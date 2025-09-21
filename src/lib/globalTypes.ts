
export type ActionState = {
    status: "INITIAL" | "PENDING" | "SUCCESS" | "ERROR";
    error: string | null;
    data: unknown | null;
  };


  export interface PrintfulSyncProduct {
    id: number;
    external_id: string | null; // sometimes null
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
  }
  
  export interface PrintfulSyncProductsResponse {
    code: number;
    result: PrintfulSyncProduct[];
    extra: any[]; // usually empty
    paging?: {
      total: number;
      offset: number;
      limit: number;
    };
  }

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
  
  // ****************************************************** Printful API Types ******************************************************
  
  // Printful API Response Types
export interface PrintfulFile {
    id: number;
    type: string;
    hash: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    url: string | null;
    visible: boolean;
    is_temporary: boolean;
    message: string;
    stitch_count_tier: string | null;
  }
  
  export interface PrintfulVariantProduct {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  }
  
  export interface PrintfulVariantOption {
    id: string;
    value: string[] | string;
  }
  
  export interface PrintfulSyncVariant {
    id: number;
    external_id: string;
    sync_product_id: number;
    name: string;
    synced: boolean;
    variant_id: number;
    main_category_id: number;
    warehouse_product_variant_id: number | null;
    retail_price: string;
    sku: string;
    currency: string;
    product: PrintfulVariantProduct;
    files: PrintfulFile[];
    options: PrintfulVariantOption[];
    is_ignored: boolean;
    size: string;
    color: string;
    availability_status: string;
    warehouse_product_id: number | null;
  }
  
  export interface PrintfulSyncProduct {
    id: number;
    external_id: string | null;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
  }

  // Detailed product information from Printful Catalog API
  export interface ProductDetails {
    variantId: number;
    materials: string[];
    description: string;
    dimensions: {
      width?: number;
      height?: number;
      depth?: number;
    };
    weight: number;
    care_instructions: string;
    features: string[];
    specifications: Record<string, any>;
  }
  
  export interface PrintfulProduct {
    sync_product: PrintfulSyncProduct;
    sync_variants: PrintfulSyncVariant[];
  }
  
  // Shop Filter Types
  export interface ShopFilters {
    colors: string[];
    sizes: string[];
    brands: string[]; // Extracted from product names
    priceRange: [number, number];
    productTypes: string[]; // Different clothing types (t-shirt, polo, hoodie, etc.)
  }
  
  export interface FilterState {
    selectedColor: string;
    selectedSize: string;
    selectedBrand: string;
    selectedType: string;
    sortBy: "price-asc" | "price-desc" | "name" | "newest";
    searchQuery: string;
    inStockOnly: boolean;
    priceRange: [number, number];
  }

  // Filter UI state structure
interface FilterOption {
    value: string;
    selected: boolean;
  }
  
  interface FilterCategory {
    categoryExpanded: boolean;
    options: FilterOption[];
  }
  
  interface FilterUIState {
    colors: FilterCategory;
    sizes: FilterCategory;
    brands: FilterCategory;
    productTypes: FilterCategory;
  }
  
  interface ShopContextType {
    availableFilters: ShopFilters;
    filterUIState: FilterUIState;
    allProducts: PrintfulProduct[];
    
    // Multi-select filter state
    selectedColors: string[];
    selectedSizes: string[];
    selectedBrands: string[];
    selectedTypes: string[];
    sortBy: FilterState["sortBy"];
    searchQuery: string;
    inStockOnly: boolean;
    priceRange: [number, number];
  }