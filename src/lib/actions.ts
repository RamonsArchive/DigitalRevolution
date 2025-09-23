"use server";
import { PrintfulProduct, PrintfulSyncProductsResponse } from "./globalTypes";
import { checkRateLimit } from "./rateLimiter";
import { parseServerActionResponse } from "./utils";
import { extractFiltersFromProducts } from "./filters";

const PRINTFUL_BASE = "https://api.printful.com";
export const getProductsAndFilters = async ({limit = 100,
    offset = 0}: { limit?: number; offset?: number }) => {
    try {
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

// New function to fetch detailed product information from Printful Catalog API
export const getProductCatalogDetails = async (variantId: number) => {
  console.log("I'm in the getProductCatalogDetails function");
  try {
    const isRateLimited = await checkRateLimit("getProductCatalogDetails");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    // Use the Catalog API endpoint (public API, no auth required)
    const response = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);

    if (!response.ok) {
      throw new Error(`Printful Catalog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        variantId,
        materials: data.result?.variant?.material || [],
        description: data.result?.product?.description || "",
        dimensions: data.result?.product?.dimensions || {},
        weight: data.result?.product?.weight || 0,
        care_instructions: data.result?.product?.care_instructions || "",
        features: data.result?.product?.features || [],
        specifications: data.result?.product?.specifications || {},
      },
    });
  } catch (error) {
    console.error("Error fetching product catalog details:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};

// Fetch product details by variant ID (this works with the sync API data)
export const getProductDetailsByVariant = async (variantId: number) => {
  try {
    const isRateLimited = await checkRateLimit("getProductDetailsByVariant");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const response = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Printful Variant API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        variantId,
        description: data.result?.product?.description || "",
        dimensions: data.result?.product?.dimensions || {},
        weight: data.result?.product?.weight || 0,
        care_instructions: data.result?.product?.care_instructions || "",
        features: data.result?.product?.features || [],
        specifications: data.result?.product?.specifications || {},
        materials: data.result?.variant?.material || [],
      },
    });
  } catch (error) {
    console.error("Error fetching product details by variant:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};

// Get product details by variant ID only (no refetching all products)
export const getProductDetailsByVariantId = async (variantId: number) => {
  try {
    const detailsResult = await getProductDetailsByVariant(variantId);
    
    if (detailsResult.status === "SUCCESS") {
      return parseServerActionResponse({
        status: "SUCCESS",
        error: "",
        data: detailsResult.data,
      });
    }

    return detailsResult;
  } catch (error) {
    console.error("Error fetching product details by variant ID:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};


export const writeToCart = async (product: PrintfulProduct, variantIndex: number, quantity: number) => {
  try {
    const isRateLimited = await checkRateLimit("writeToCart");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }
  } catch (error) {
    console.error("Error writing to cart:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
}