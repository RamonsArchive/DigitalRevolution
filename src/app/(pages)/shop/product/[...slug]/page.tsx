import ProductPageClient from "./ProductPageClient";
import ProductProvider from "@/contexts/ProductContext";
import { auth } from "../../../../../../auth";
import { cookies } from "next/headers";
import { getCart } from "@/lib/actions";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const slug = (await params).slug.pop() || "";
  const session = await auth();
  const userId = session?.user?.id || "";
  const cookieStore = await cookies();
  const guestUserId = cookieStore.get("userId")?.value;

  // fetch cart items here on server and revlaidate.

  const cartItems = await getCart(userId, guestUserId || "");
  console.log(cartItems);

  return (
    <ProductPageClient
      slug={slug}
      cartItems={cartItems.data?.cartItems || []}
      userId={userId}
      guestUserId={guestUserId || ""}
    />
  );
};

export default ProductPage;
