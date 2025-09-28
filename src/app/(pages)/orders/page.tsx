import React from "react";
import { auth } from "../../../../auth";
import { getOrders } from "@/lib/actions";
import OrdersPageClient from "@/components/OrdersPageClient";

const OrdersPage = async () => {
  const session = await auth();
  const userId = session?.user?.id || "";

  if (!userId) {
    return <div>You are not logged in. Log in to view your orders</div>;
  }
  const ordersResult = await getOrders(userId);

  if (ordersResult.status === "ERROR") {
    return <div>Error loading orders: {ordersResult.error}</div>;
  }

  return <OrdersPageClient orders={ordersResult.data || []} />;
};

export default OrdersPage;
