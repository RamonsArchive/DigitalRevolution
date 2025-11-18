import React from "react";
import { Order, OrderItem } from "../../prisma/generated/prisma";

const PrintfulOrderConfirmationEmail = ({
  order: _order, // eslint-disable-line @typescript-eslint/no-unused-vars
  items: _items, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  order: Order;
  items: OrderItem[];
}) => {
  return <div>PrintfulOrderConfirmation</div>;
};

export default PrintfulOrderConfirmationEmail;
