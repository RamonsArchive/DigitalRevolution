import ProductPageClient from "./ProductPageClient";
import ProductProvider from "@/contexts/ProductContext";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const slug = (await params).slug.pop() || "";

  return (
    <ProductProvider>
      <ProductPageClient slug={slug} />
    </ProductProvider>
  );
};

export default ProductPage;
