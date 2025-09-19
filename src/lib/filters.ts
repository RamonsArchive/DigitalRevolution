"use server";

import { PrintfulProduct, ShopFilters } from './globalTypes';

export const extractFiltersFromProducts = async (products: PrintfulProduct[]): Promise<ShopFilters> => {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  const brands = new Set<string>();
  const productTypes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  products.forEach((product) => {
    // Extract brand from product name (before "Digital Revolution")
    const productName = product.sync_product.name;
    let brand = "Unknown";
    
    if (productName.includes("Founder's")) {
      brand = "Founder's";
    } else if (productName.includes("Xen")) {
      brand = "Xen";
    } else {
      // Try to extract brand from the beginning of the name
      const parts = productName.split(' ');
      if (parts.length > 0) {
        brand = parts[0];
      }
    }
    brands.add(brand);

    // Extract product type from name (t-shirt, polo, hoodie, etc.)
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('t-shirt') || lowerName.includes('tee')) {
      productTypes.add('T-Shirt');
    } else if (lowerName.includes('polo')) {
      productTypes.add('Polo Shirt');
    } else if (lowerName.includes('hoodie')) {
      productTypes.add('Hoodie');
    } else if (lowerName.includes('sweatshirt')) {
      productTypes.add('Sweatshirt');
    } else if (lowerName.includes('tank')) {
      productTypes.add('Tank Top');
    } else if (lowerName.includes('long sleeve')) {
      productTypes.add('Long Sleeve');
    } else {
      productTypes.add('Other');
    }

    // Process variants for colors, sizes, and prices
    product.sync_variants.forEach((variant) => {
      // Only include active variants
      if (variant.availability_status === 'active' && !variant.is_ignored) {
        colors.add(variant.color);
        sizes.add(variant.size);
        
        const price = parseFloat(variant.retail_price);
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });
  });

  // Sort sizes in logical order
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const sortedSizes = Array.from(sizes).sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return {
    colors: Array.from(colors).sort(),
    sizes: sortedSizes,
    brands: Array.from(brands).sort(),
    productTypes: Array.from(productTypes).sort(),
    priceRange: [
      minPrice === Infinity ? 0 : Math.floor(minPrice),
      maxPrice === -Infinity ? 100 : Math.ceil(maxPrice)
    ]
    
  };
};

// Helper function to get unique variants (for display)
export const getUniqueProductVariants = async (products: PrintfulProduct[]) => {
  return products.map(product => ({
    ...product,
    sync_variants: product.sync_variants.filter(
      variant => variant.availability_status === 'active' && !variant.is_ignored
    )
  })).filter(product => product.sync_variants.length > 0);
};