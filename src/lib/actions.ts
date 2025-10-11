"use server";
import { PrintfulProduct, PrintfulSyncProductsResponse, PrintfulSyncProduct } from "./globalTypes";
import { checkRateLimit } from "./rateLimiter";
import { parseServerActionResponse } from "./utils";
import { extractFiltersFromProducts } from "./filters";
import { prisma } from "./prisma";
import { revalidateTag, unstable_cache } from 'next/cache';
import { CartItem, Cart, Address } from "../../prisma/generated/prisma";
import { stripe } from "./stripe";
import PartnersTicketEmail from "../emails/PartnersTicketEmail";
import { sendSubscriptionCancelledEmail } from "./donation-emails";


const PRINTFUL_BASE = "https://api.printful.com";

// Cached version of products and filters fetch
const getCachedProductsAndFilters = unstable_cache(
  async ({limit = 100, offset = 0}: { limit?: number; offset?: number }) => {
    const syncProducts = await getSyncProducts({limit, offset});
    if (syncProducts.status === "ERROR") {
      return syncProducts;
    }
    
    // batch get the products and their variants
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
    });
  },
  ['products-and-filters'], // Cache key
  {
    revalidate: 300, // Revalidate every 5 minutes
    tags: ['products']
  }
);

export const getProductsAndFilters = async ({limit = 100,
    offset = 0}: { limit?: number; offset?: number }) => {
    try {
        const isRateLimited = await checkRateLimit("getProductsAndFilters");
        if (isRateLimited.status === "ERROR") {
            return isRateLimited;
        }

        return await getCachedProductsAndFilters({limit, offset});

    } catch (error) {
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
        const res = await fetch(url, { 
            headers, 
            next: { revalidate: 300 } // Cache for 5 minutes
        });
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
        const res = await fetch(url, { 
            headers, 
            next: { revalidate: 300 } // Cache for 5 minutes
        });
        
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
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
}

// New function to fetch detailed product information from Printful Catalog API
export const getProductCatalogDetails = async (variantId: number) => {
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

    if (!response.ok) {
      throw new Error(`Printful Catalog API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
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
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};

export const writeToCart = async (
  userId: string, 
  guestUserId: string,
  product: PrintfulProduct, 
  variantIndex: number, 
  quantity: number,
) => {
  try {
    const isRateLimited = await checkRateLimit("writeToCart");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    // Get the specific variant from the product
    const selectedVariant = product.sync_variants[variantIndex];
    if (!selectedVariant) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Invalid variant index",
        data: null,
      });
    }

    // Build the where condition to find the cart
    const cartWhereCondition = userId 
      ? { userId } 
      : { tempCartId: guestUserId };

    // Find or create the cart
    let cart = await prisma.cart.findFirst({
      where: cartWhereCondition,
      include: {
        items: true
      }
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          ...(userId ? { userId } : { tempCartId: guestUserId }),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        include: {
          items: true
        }
      });
    }

    // Check if item already exists in cart
    const existingCartItem = cart.items.find(
      item => item.printfulVariantId === selectedVariant.variant_id
    );

    let updatedCartItem;

    if (existingCartItem) {
      // Update existing cart item - add to existing quantity
    
      //const newQuantity = existingCartItem.quantity + quantity;
      const newQuantity = existingCartItem.quantity + quantity;
    
      updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: newQuantity,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new cart item with Printful data
      updatedCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          printfulExternalId: selectedVariant.external_id,
          printfulVariantId: selectedVariant.variant_id,
          printfulProductId: selectedVariant.product.product_id,
          variantName: selectedVariant.name,
          productName: selectedVariant.product.name,
          size: selectedVariant.size || "",
          color: selectedVariant.color || "",
          sku: selectedVariant.sku || null,
          unitPrice: Math.round(parseFloat(selectedVariant.retail_price) * 100), // Convert to cents
          quantity: quantity,
          imageUrl: selectedVariant.files?.[1]?.preview_url || selectedVariant.product.image || null,
        }
      });
    }

    // Update cart's updatedAt timestamp
    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() }
    });

    const cacheKey = userId || guestUserId || 'anonymous';
    revalidateTag(`cart-${cacheKey}`);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        cartItem: updatedCartItem,
        action: existingCartItem ? "updated" : "created",
        totalQuantity: updatedCartItem.quantity
      },
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  userId: string,
  guestUserId: string,
  itemId: number,
  newQuantity: number
) => {
  try {
    const isRateLimited = await checkRateLimit("updateCartItemQuantity");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    if (newQuantity <= 0) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Quantity must be greater than 0",
        data: null,
      });
    }

    // Build the where condition to find the cart
    const cartWhereCondition = userId 
      ? { userId } 
      : { tempCartId: guestUserId };

    // Find the cart
    const cart = await prisma.cart.findFirst({
      where: cartWhereCondition,
    });

    if (!cart) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Cart not found",
        data: null,
      });
    }

    // Update the cart item quantity
    const updatedItem = await prisma.cartItem.update({
      where: { 
        id: itemId,
        cartId: cart.id // Ensure the item belongs to the user's cart
      },
      data: { 
        quantity: newQuantity,
        updatedAt: new Date()
      }
    });

    // Update cart's updatedAt timestamp
    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() }
    });

    const cacheKey = userId || guestUserId || 'anonymous';
    revalidateTag(`cart-${cacheKey}`);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        cartItem: updatedItem,
        action: "updated"
      },
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    });
  }
};

// Remove item from cart
export const removeCartItem = async (
  userId: string,
  guestUserId: string,
  itemId: number
) => {
  try {
    const isRateLimited = await checkRateLimit("removeCartItem");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    // Build the where condition to find the cart
    const cartWhereCondition = userId 
      ? { userId } 
      : { tempCartId: guestUserId };

    // Find the cart
    const cart = await prisma.cart.findFirst({
      where: cartWhereCondition,
    });

    if (!cart) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Cart not found",
        data: null,
      });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { 
        id: itemId,
        cartId: cart.id // Ensure the item belongs to the user's cart
      }
    });

    // Update cart's updatedAt timestamp
    await prisma.cart.update({
      where: { id: cart.id },
      data: { updatedAt: new Date() }
    });

    const cacheKey = userId || guestUserId || 'anonymous';
    revalidateTag(`cart-${cacheKey}`);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        action: "removed",
        itemId: itemId
      },
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    });
  }
};

// Fixed getCart with proper cache keys
export const getCart = async (userId: string, guestUserId?: string) => {
  const cacheKey = userId || guestUserId || 'anonymous';
  
  const getCachedCart = unstable_cache(
    async () => {
      try {
        // Build the where condition for finding the cart
        const whereCondition = userId 
          ? { userId } 
          : { tempCartId: guestUserId };

        // Find the cart and its items
        const cart = await prisma.cart.findFirst({
          where: whereCondition,
          include: {
            items: {
              orderBy: {
                addedAt: 'desc'
              }
            }
          }
        });

        const cartItems = cart?.items || [];

        return {
          cartItems,
          cartId: cart?.id || null,
          totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          estimatedTotal: cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
        };
      } catch (error) {
        throw error;
      }
    },
    [`cart-${cacheKey}`],
    {
      tags: [`cart-${cacheKey}`],
      revalidate: 300 // 5 minutes
    }
  );

  try {
    const data = await getCachedCart();
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
};

// 1. Validate cart and check stock
export const validateCartForCheckout = async (userId: string, guestUserId: string) => {
  try {
    const whereCondition = userId 
      ? { userId } 
      : { tempCartId: guestUserId };
    const cart = await prisma.cart.findFirst({
      where: whereCondition,
      include: { items: true }
    });

    if (!cart || cart.items.length === 0) {
      return parseServerActionResponse({
        status: "ERROR",
        data: null,
        error: 'Cart is empty or not found'
      });
    }

    // Check stock for all items
    const stockChecks = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const response = await fetch(`https://api.printful.com/products/variant/${item.printfulVariantId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.DIGITAL_REVOLUTION_API_KEY}`
            }
          });
          
          const data = await response.json();
          return parseServerActionResponse({
            status: 'SUCCESS',
            error: "",
            data: {
              item,
              isInStock: data.result?.variant?.in_stock || false
            }
          });
        } catch (error) {
          return parseServerActionResponse({
            status: "ERROR",
            error: "",
            data: {
              item,
              isInStock: false // Assume out of stock if check fails
            }
          });
        }
      })
    );

    const outOfStockItems = stockChecks.filter(check => !check.data?.isInStock);
    if (outOfStockItems.length > 0) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Some items are out of stock",
        data: {
          outOfStockItems: outOfStockItems.map(check => check.data?.item)
        }
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        cart,
        items: cart.items
      }
    });

  } catch (error) {
    return parseServerActionResponse({
      status: 'ERROR',
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
};


export const createCheckoutSession = async (userId: string, guestUserId: string) => {
  try {
    const isRateLimited = await checkRateLimit("createCheckoutSession");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const cartValidation = await validateCartForCheckout(userId, guestUserId);
    if (cartValidation.status === "ERROR") {
      return cartValidation;
    }
    const cart = (cartValidation.data as unknown as { cart: Cart }).cart;
    const items = (cartValidation.data as unknown as { items: CartItem[] }).items;

    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const shippingCost = 0; // free shipping for all orders
    const taxAmount = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + shippingCost + taxAmount;

    const checkoutSession = await prisma.checkoutSession.create({
      data: {
        stripeSessionId: "",
        cartId: cart.id,
        subtotal,
        estimatedTax: taxAmount,
        estimatedShipping: shippingCost,
        promoDiscount: 0,
        estimatedTotal: total,
        status: "pending",
      }
    })

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        ...items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.productName} - ${item.variantName}`,
              description: `Size: ${item.size}, Color: ${item.color}`,
              images: item.imageUrl ? [item.imageUrl] : [],
            },
            unit_amount: item.unitPrice,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tax",
            },
            unit_amount: taxAmount,
          },
          quantity: 1
        }
      ],
      metadata: {
        cartId: cart.id.toString(),
        userId: userId || "",
        guestUserId: guestUserId || "", // Add this
        checkoutSessionId: checkoutSession.id.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // This is required!
      },
      customer_creation: 'always',
    });

    await prisma.checkoutSession.update({
      where: { id: checkoutSession.id },
      data: { stripeSessionId: stripeSession.id }
    });

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        stripeSessionId: stripeSession.id,
        sessionUrl: stripeSession.url,
      },
    });

    
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    })
  }
}


export const createPrintfulOrder = async (orderId: number, cartItems: CartItem[], shippingAddress: Address, email: string | null) => {
  try {
    const printfulOrderData = {
      recipient: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        address1: shippingAddress.line1,
        address2: shippingAddress.line2 || '',
        city: shippingAddress.city,
        state_code: shippingAddress.state,
        country_code: shippingAddress.country,
        zip: shippingAddress.postalCode,
        phone: shippingAddress.phone || '',
        email: email || ''
      },
      items: cartItems.map(item => ({
        external_variant_id: item.printfulExternalId,
        quantity: item.quantity
      }))
    };

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIGITAL_REVOLUTION_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printfulOrderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Printful order creation failed: ${result.error?.message}`);
    }

    return parseServerActionResponse({
      status: 'SUCCESS',
      error: "",
      data: {
        printfulOrderId: result.result.id,
        printfulStatus: result.result.status,
        printfulData: result.result
      }
    });
  } catch (error) {
    return parseServerActionResponse({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    });
  }
};




/////////////////////////////////////////////////////
// Get order by stripe session id
/////////////////////////////////////////////////////
export const getOrderByStripeSessionId = async (sessionId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId
      },
      include: {
        items: true
      }
    });
    if (!order) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Order not found",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: order,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error,
      data: null,
    });
  }
};

const sendEmailToAdmin = async (formData: Record<string, string>) => {
  try {
    await PartnersTicketEmail({ formData });
  } catch (error) {
    throw error;
  }
};

export const submitPartnersForm = async (formData: Record<string, string>) => {
  try {
    const isRateLimited = await checkRateLimit("submitPartnersForm");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      organization,
      message,
    } = formData;

    const partnersFromSubmit = await prisma.partnerTicket.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        organization,
        message,
      }
    })
    if (!partnersFromSubmit) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Failed to submit partners form",
        data: null,
      });
    }

    await sendEmailToAdmin(formData);

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: partnersFromSubmit,
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}

const getOrCreateStripeCustomer = async (userId: string, email: string): Promise<string> => {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, email: true, name: true },
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: user?.name || undefined,
    metadata: {
      userId,
    },
  });

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}



const createDonationCheckout = async ({userId, amount, name, email}: {userId?: string, amount: number, name: string, email: string}) => {
  try {

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to Digital Revolution",
              description: "Supporting digital equity and STEM education",
            },
            unit_amount: amount,
          },
          quantity: 1,
        }
      ],
      customer_email: email,
      metadata: {
        type: "donation",
        name: name,
        userId: userId || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/cancel`,
    });

    await prisma.donation.create({
      data: {
        stripeSessionId: session.id,
        donorEmail: email,
        donorName: name,
        amount: amount,
        currency: "usd",
        status: "pending",
        donationType: "one-time",
      }
    })
      
     return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        stripeSessionId: session.id,
        url: session.url,
      },
     })

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}


export const createSubscriptionCheckout = async ({userId, amount, name, email}: {userId: string, amount: number, name: string, email: string}) => {
  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(userId, email);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: 'Monthly Donation to Digital Revolution',
              description: 'Recurring support for digital equity and STEM education',
            },
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        }
      ],
      metadata: {
        type: "subscription",
        name: name,
        userId: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/cancel`,
      subscription_data: {
        metadata: {
          userId,
          type: "donation",
        }
      }
    })

    if (!session) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Failed to create subscription session",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: {
        stripeSessionId: session.id,
        url: session.url,
      },
    });
    
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    }); 
  }
}


export const createDonationSession = async ({userId, amount, name, email}: {userId?: string, amount: number, name: string, email: string}) => {
  try {
    const isRateLimited = await checkRateLimit("createDonationCheckout");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    if (!amount || !email) {
      throw new Error("Amount and email are required");
    }

    const result = await createDonationCheckout({
      userId,
      amount,
      name,
      email,
    })

    return result;

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}


export const createSubscriptionSession = async ({userId, amount, name, email}: {userId: string, amount: number, name: string, email: string}) => {
  try {

    const isRateLimited = await checkRateLimit("createSubscriptionSession");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }


    if (!userId || !amount || !email) {
      throw new Error("Amount and email are required");
    }

    const result = await createSubscriptionCheckout({
      userId,
      amount,
      name,
      email,
    })
    
    return result;

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}


export const getSubscription = async (userId: string) => {
  try {

    const isRateLimited = await checkRateLimit("getSubscription");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: userId },
    });
    if (!subscriptions) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "No subscriptions found",
        data: null,
      });
    }
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: subscriptions,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}


export const getDonationByStripeSessionId = async (stripeSessionId: string) => {
  try {

    const isRateLimited = await checkRateLimit("getDonationByStripeSessionId");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    if (!stripeSessionId) {
      throw new Error("User ID is required");
    }

    const donation = await prisma.donation.findFirst({
      where: { stripeSessionId: stripeSessionId },
    });

    if (!donation) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Donation not found",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: donation,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}

export const getLatestSubscription = async (userId: string) => {
  try {
    const isRateLimited = await checkRateLimit("getLatestSubscription");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Subscription not found",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: subscription,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}

export const getSubscriptionByStripeSessionId = async (stripeSessionId: string) => {
  try {
    const isRateLimited = await checkRateLimit("getSubscriptionByStripeSessionId");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    if (!stripeSessionId) {
      throw new Error("Session ID is required");
    }

    // First, we need to get the session from Stripe to find the subscription ID
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    
    if (!session.subscription) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "No subscription found in session",
        data: null,
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: session.subscription as string },
    });

    if (!subscription) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Subscription not found",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: subscription,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}



export const cancelSubscription = async (subscriptionId: number, reason: string) => {
  try {
    const isRateLimited = await checkRateLimit("cancelSubscription");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    // First, get the subscription from database to get Stripe subscription ID
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true }
    });

    if (!subscription) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Subscription not found",
        data: null,
      });
    }

    if (subscription.status === 'canceled') {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Subscription is already canceled",
        data: null,
      });
    }

    // Cancel the subscription in Stripe
    try {
      // Option 1: Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (stripeError: any) {
      return parseServerActionResponse({
        status: "ERROR",
        error: `Failed to cancel subscription with Stripe: ${stripeError.message}`,
        data: null,
      });
    }

    // Update subscription in local database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "canceled",
        cancelReason: reason,
        canceledAt: new Date(),
      },
      include: { user: true }
    });

    // Send cancellation confirmation email
    try {
      await sendSubscriptionCancelledEmail(
        updatedSubscription,
        updatedSubscription.user.email,
        updatedSubscription.user.name || undefined,
        reason
      );
    } catch (emailError) {
      // Don't fail the entire operation if email fails
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: updatedSubscription,
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
};

export const getOrders = async (userId: string) => {
  try {
    const isRateLimited = await checkRateLimit("getOrders");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!orders) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "No orders found",
        data: null,
      });
    }

    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: orders,
    });
  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}

export const getSingleProductBySlug = async (slug: string) => {
  try {
    const isRateLimited = await checkRateLimit("getSingleProductBySlug");
    if (isRateLimited.status === "ERROR") {
      return isRateLimited;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${process.env.DIGITAL_REVOLUTION_API_KEY!}`,
    };

    // Step 1: Fetch the lightweight sync products list to find the sync_product_id
    const syncProductsUrl = `${PRINTFUL_BASE}/store/products?limit=100`;
    const syncRes = await fetch(syncProductsUrl, { headers, cache: "no-store" });
    
    if (!syncRes.ok) {
      throw new Error(`Failed to fetch product list: ${syncRes.status} ${syncRes.statusText}`);
    }

    const syncData = await syncRes.json();
    
    // Find the product with matching external_id (slug)
    const matchingProduct = syncData.result?.find(
      (p: PrintfulSyncProduct) => p.external_id?.toLowerCase() === slug.toLowerCase()
    );

    if (!matchingProduct) {
      return parseServerActionResponse({
        status: "ERROR",
        error: "Product not found",
        data: null,
      });
    }

    // Step 2: Fetch the full product details using the sync_product_id
    const productDetailsUrl = `${PRINTFUL_BASE}/store/products/${matchingProduct.id}`;
    const detailsRes = await fetch(productDetailsUrl, { headers, cache: "no-store" });

    if (!detailsRes.ok) {
      throw new Error(`Failed to fetch product details: ${detailsRes.status} ${detailsRes.statusText}`);
    }

    const detailsData = await detailsRes.json();
    
    return parseServerActionResponse({
      status: "SUCCESS",
      error: "",
      data: detailsData.result,
    });

  } catch (error) {
    return parseServerActionResponse({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    });
  }
}