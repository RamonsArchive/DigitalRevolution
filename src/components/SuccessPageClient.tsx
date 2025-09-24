import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOrderByStripeSessionId } from "@/lib/actions"; // You'll need to create this

async function SuccessPageClient({ sessionId }: { sessionId: string }) {
  const order = await getOrderByStripeSessionId(sessionId);
  console.log(order);
  const {
    orderNumber,
    customerEmail,
    amountTotal,
    status,
    items,
    shippingAddress,
  } = order.data as {
    orderNumber: string;
    customerEmail: string;
    amountTotal: number;
    status: string;
    items: any[];
    shippingAddress: any;
  };

  if (!order.data) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-green-700">
          Your order has been confirmed and is being processed.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="mb-4">
          <p>
            <strong>Order Number:</strong> {orderNumber}
          </p>
          <p>
            <strong>Email:</strong> {customerEmail}
          </p>
          <p>
            <strong>Total:</strong> ${(amountTotal / 100).toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-3">Items Ordered:</h3>
        <div className="space-y-3">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  {item.variantName} - Qty: {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                ${(item.totalPrice / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Shipping Address:</h4>
          <div className="text-sm">
            <p>
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p>{shippingAddress.line1}</p>
            {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            You'll receive an email confirmation shortly with tracking
            information.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPageClient;
