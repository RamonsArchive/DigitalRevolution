"use server";
import { PrintfulProduct, PrintfulSyncProductsResponse } from "./globalTypes";
import { checkRateLimit } from "./rateLimiter";
import { parseServerActionResponse } from "./utils";
import { extractFiltersFromProducts } from "./filters";

const PRINTFUL_BASE = "https://api.printful.com";
export const getProductsAndFilters = async ({limit = 100,
    offset = 0}: { limit?: number; offset?: number }) => {
    try {
        console.log("getProductsAndFilters");

        const isRateLimited = await checkRateLimit("getProductsAndFilters");
        if (isRateLimited.status === "ERROR") {
            return isRateLimited;
        }

        const syncProducts = await getSyncProducts({limit, offset});
        if (syncProducts.status === "ERROR") {
            return syncProducts;
        }
        // batch get the products and their varinats
        const allProducts = await getAllProductsBatch(syncProducts.data);
        if (allProducts.status === "ERROR") {
            return allProducts;
        }

        const filters = await extractFiltersFromProducts(allProducts.data as PrintfulProduct[]);

        return parseServerActionResponse({
            status: "SUCCESS",
            error: "",
            data: {
                allProducts: allProducts.data,
                filters: filters,
            },
        })

    } catch (error) {
        console.error(error);
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
    
}

const getSyncProducts = async ({limit = 100,
    offset = 0}: { limit?: number; offset?: number }) => {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${process.env.DIGITAL_REVOLUTION_API_KEY!}`,
    };
    try {
        // get sync products high level info
        const url = `${PRINTFUL_BASE}/store/products?limit=${limit}&offset=${offset}`;
        const res = await fetch(url, { headers, cache: "no-store" });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(
              `Printful fetch failed: ${res.status} ${res.statusText} :: ${text}`
            );
          }
        const productJson = await res.json();
        return parseServerActionResponse({
            status: "SUCCESS",
            error: "",
            data: productJson,
        })

    } catch (error) {
        console.error(error);
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
    
}

export const getProductDetails = async (productId: number) => {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${process.env.DIGITAL_REVOLUTION_API_KEY!}`,
    };
    
    try {

        const url = `${PRINTFUL_BASE}/store/products/${productId}`;
        const res = await fetch(url, { headers, cache: "no-store" });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch product ${productId}: ${res.statusText}`);
        }
        
        const data = await res.json();
        return parseServerActionResponse({
            status: "SUCCESS",
            error: "",
            data: data.result,
        })
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
};



const getAllProductsBatch = async (productJson: PrintfulSyncProductsResponse) => {
    try {
        if (!productJson.result) {
            throw new Error("No products found");
        }
        const products = productJson.result;
        const batchSize = 5; // Process 5 products at a time to respect rate limits
        const allProductsWithVariants = [];

        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            const batchPromises = batch.map(product => getProductDetails(product.id));
            const batchResults = await Promise.all(batchPromises);
            const successfulResults = batchResults
            .filter(result => result.status === "SUCCESS")
            .map(result => result.data);
            allProductsWithVariants.push(...successfulResults);

            // no delay for max speed
        }

        return parseServerActionResponse({
            status: "SUCCESS",
            error: "",
            data: allProductsWithVariants,
        })

    } catch (error) {
        console.error(error);
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
}
