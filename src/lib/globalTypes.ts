
export type ActionState = {
    status: "INITIAL" | "PENDING" | "SUCCESS" | "ERROR";
    error: string | null;
    data: unknown | null;
  };

export type AnimateTextType = {
    targets: string[];
    type: "chars" | "words";
    duration: number;
    ease: string;
    delay?: number;
    opacity: number;
    y: number;
    stagger?: number;
}

export type AnimateTextScrollType = {
    targets: string[];
    type: "chars" | "words";
    animateClass: string;
    duration: number;
    ease: string;
    delay?: number;
    opacity: number;
    y: number;
    stagger?: number;
    scrollTrigger: {
        trigger?: string;
        start: string;
        end: string;
        scrub: number;
    }
}

export type AnimateCardScrollType = {
    targets: string[];
    duration: number;
    ease: string;
    delay?: number;
    opacity: number;
    y: number;
    stagger?: number;
    scrollTrigger: {
        trigger?: string;
        start: string;
        end: string;
        scrub: number;
    }
}


// VARIANT AND PRODUCT TYPES 

// globalTypes.ts - Printful API Types

// Base interfaces for Printful API responses
export interface PrintfulVariant {
    id: number;
    product_id: number;
    name: string;
    size: string;
    color: string;
    color_code: string;
    color_code2?: string;
    image: string;
    price: string; // Printful returns price as string
    in_stock: boolean;
    availability_regions: Record<string, any>; // Can be more specific based on your needs
    availability_status: string[];
    material: string[];
  }
  
  export interface PrintfulProduct {
    id: number;
    main_category_id: number;
    type: string;
    type_name: string;
    title: string;
    brand: string;
    model: string;
    image: string;
    variant_count: number;
    currency: string;
    files: PrintfulFile[];
    options: PrintfulOption[];
    is_discontinued: boolean;
    avg_fulfillment_time: number;
    description: string;
    techniques: PrintfulTechnique[];
    origin_country: string;
  }
  
  // Additional supporting interfaces
  export interface PrintfulFile {
    id?: number;
    type?: string;
    url?: string;
    filename?: string;
    mime_type?: string;
    size?: number;
    width?: number;
    height?: number;
    dpi?: number;
  }
  
  export interface PrintfulOption {
    id: string;
    title: string;
    type: string;
    values: Record<string, any>;
    additional_price?: string;
  }
  
  export interface PrintfulTechnique {
    key: string;
    display_name: string;
    is_default: boolean;
  }
  
  // API Response wrapper
  export interface PrintfulApiResponse<T> {
    code: number;
    result: T;
    extra?: Record<string, any>;
    paging?: {
      total: number;
      offset: number;
      limit: number;
    };
  }
  
  // Specific response types
  export interface PrintfulVariantResponse extends PrintfulApiResponse<{
    variant: PrintfulVariant;
    product: PrintfulProduct;
  }> {}
  
  export interface PrintfulProductsResponse extends PrintfulApiResponse<PrintfulProduct[]> {}
  
  export interface PrintfulVariantsResponse extends PrintfulApiResponse<{
    product: PrintfulProduct;
    variants: PrintfulVariant[];
  }> {}
  
  // Transformed types for your application (normalized)
  export interface Product {
    id: string; // Converted from number for consistency
    printfulId: number; // Keep original ID for API calls
    name: string;
    title: string;
    brand: string;
    model: string;
    type: string;
    typeName: string;
    description: string;
    image: string;
    currency: string;
    category: ProductCategory;
    isDiscontinued: boolean;
    avgFulfillmentTime: number;
    originCountry: string;
    variants: ProductVariant[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ProductVariant {
    id: string; // Converted from number
    printfulId: number; // Keep original ID for API calls
    productId: string;
    printfulProductId: number;
    name: string;
    size: string;
    color: string;
    colorCode: string;
    colorCode2?: string;
    image: string;
    price: number; // Converted from string to number
    originalPrice: string; // Keep original string format
    inStock: boolean;
    availabilityRegions: Record<string, any>;
    availabilityStatus: string[];
    material: string[];
  }
  
  // Category mapping (you'll need to define based on Printful categories)
  export type ProductCategory = 
    | 'men' 
    | 'women' 
    | 'kids' 
    | 'unisex' 
    | 'accessories' 
    | 'home-living';
  
  // Shop-specific types (for your context)
  export interface ShopFilters {
    category: ProductCategory | 'all';
    priceRange: { min: number; max: number };
    colors: string[];
    sizes: string[];
    brands: string[];
    sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'popular';
    searchQuery: string;
    inStockOnly: boolean;
  }
  
  export interface CartItem {
    id: string; // Unique cart item ID
    productId: string;
    variantId: string;
    quantity: number;
    product: Product;
    variant: ProductVariant;
    addedAt: Date;
  }
  
  export interface ShopState {
    products: Product[];
    filteredProducts: Product[];
    filters: ShopFilters;
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
    cart: CartItem[];
    favorites: string[]; // Product IDs
    recentlyViewed: string[]; // Product IDs
  }
  
  // API Error types
  export interface PrintfulError {
    code: number;
    message: string;
    details?: Record<string, any>;
  }
  
  // Utility type for API calls
  export interface ApiCallOptions {
    cache?: boolean;
    revalidate?: number;
  }
  
  // Transform functions type definitions
  export type PrintfulToProductTransform = (
    printfulProduct: PrintfulProduct,
    variants: PrintfulVariant[]
  ) => Product;
  
  export type PrintfulVariantToVariantTransform = (
    printfulVariant: PrintfulVariant
  ) => ProductVariant;
  
  // Search and pagination types
  export interface ProductSearchParams {
    query?: string;
    category?: ProductCategory | 'all';
    page?: number;
    limit?: number;
    sortBy?: ShopFilters['sortBy'];
    filters?: Partial<ShopFilters>;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }
  
  // Server action types
  export interface FetchProductsResult {
    products: Product[];
    error?: string;
  }
  
  export interface FetchProductResult {
    product: Product | null;
    error?: string;
  }