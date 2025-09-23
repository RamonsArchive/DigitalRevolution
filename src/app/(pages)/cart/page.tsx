import React from "react";
import { auth } from "../../../../auth";
import { cookies } from "next/headers";
import { getCart } from "@/lib/actions";
import CartPageClient from "@/components/CartPageClient";

const CartPage = async () => {
  const session = await auth();
  const userId = session?.user?.id || "";
  console.log("userId", userId);
  const cookieStore = await cookies();
  const guestUserId = cookieStore.get("userId")?.value || "";
  console.log("guestUserId", guestUserId);
  const cartItems = await getCart(userId, guestUserId);
  console.log("cartItems", cartItems);

  return (
    <CartPageClient
      userId={userId}
      guestUserId={guestUserId}
      cartItems={cartItems.data?.cartItems || []}
    />
  );
};

export default CartPage;
