import React from "react";
import { Order, OrderItem } from "../../prisma/generated/prisma";

const PrintfulOrderConfirmationEmail = ({
  order,
  items,
}: {
  order: Order;
  items: OrderItem[];
}) => {
  return <div>PrintfulOrderConfirmation</div>;
};

export default PrintfulOrderConfirmationEmail;
