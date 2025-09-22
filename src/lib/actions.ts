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

// Alternative: Fetch product-level details (more efficient, fewer API calls)
export const getProductDetailsFromCatalog = async (productId: number) => {
  try {
    const isRateLimited = await checkRateLimit("getProductDetails");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const response = await fetch(`https://api.printful.com/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Printful Product API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        productId,
        description: data.result?.description || "",
        dimensions: data.result?.dimensions || {},
        weight: data.result?.weight || 0,
        care_instructions: data.result?.care_instructions || "",
        features: data.result?.features || [],
        specifications: data.result?.specifications || {},
        // Get materials from the first variant as a fallback
        materials: data.result?.variants?.[0]?.material || [],
      },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};

// Highly optimized function that fetches product-level details instead of variant-level
export const fetchAllProductDetails = async (products: PrintfulProduct[]) => {
  try {
    console.log(`Starting optimized product details fetch for ${products.length} products...`);

    // Create a map to store product details
    const productDetailsMap = new Map();
    let processedProducts = 0;

    // Get unique product IDs (much fewer than variants)
    const productIds = new Set<number>();
    products.forEach(product => {
      if (product.sync_product.id) {
        productIds.add(product.sync_product.id);
      }
    });

    console.log(`Fetching details for ${productIds.size} unique products (instead of ${products.reduce((sum, p) => sum + p.sync_variants.length, 0)} variants)`);

    // Process products in small batches to avoid rate limiting
    const BATCH_SIZE = 3; // Very small batch size
    const DELAY_BETWEEN_BATCHES = 2000; // 2 second delay between batches
    const DELAY_BETWEEN_REQUESTS = 500; // 500ms delay between individual requests

    const productIdArray = Array.from(productIds);

    for (let i = 0; i < productIdArray.length; i += BATCH_SIZE) {
      const batch = productIdArray.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing product batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(productIdArray.length / BATCH_SIZE)}`);

      // Process each product in the batch with delays
      for (const productId of batch) {
        try {
          // Add delay between individual requests
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
          
          const result = await getProductDetailsFromCatalog(productId);
          if (result.status === 'SUCCESS') {
            // Store product details for all variants of this product
            const product = products.find(p => p.sync_product.id === productId);
            if (product && result.data) {
              product.sync_variants.forEach(variant => {
                productDetailsMap.set(variant.variant_id, {
                  ...result.data,
                  variantId: variant.variant_id,
                  // Use product-level materials as fallback
                  materials: result.data.materials,
                });
              });
            }
            processedProducts++;
          }
        } catch (error) {
          console.warn(`Failed to fetch details for product ${productId}:`, error);
        }
      }
    }

    console.log(`Successfully processed ${processedProducts}/${productIdArray.length} products`);

    // Convert Map to plain object for serialization
    const serializableMap = Object.fromEntries(productDetailsMap);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: serializableMap,
    });
  } catch (error) {
    console.error("Error fetching all product details:", error);
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: {},
    });
  }
};
