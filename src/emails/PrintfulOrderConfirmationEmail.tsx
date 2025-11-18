import React from "react";
import { Order, OrderItem } from "../../prisma/generated/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PrintfulOrderConfirmationEmail = ({
  order: _order,
  items: _items,
}: {
  order: Order;
  items: OrderItem[];
}) => {
  return <div>PrintfulOrderConfirmation</div>;
};

export default PrintfulOrderConfirmationEmail;
