import React from "react";
import { getSubscriptionByStripeSessionId } from "@/lib/actions";
import SubscriptionSuccessClient from "@/components/SubscriptionSuccessClient";

const SubscriptionSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const stripeSessionId = (await searchParams).session_id;

  if (!stripeSessionId) {
    return (
      <SubscriptionSuccessClient
        subscription={null}
        error="No session ID provided"
      />
    );
  }

  const subscriptionResult =
    await getSubscriptionByStripeSessionId(stripeSessionId);

  if (subscriptionResult.status === "ERROR") {
    return (
      <SubscriptionSuccessClient
        subscription={null}
        error={subscriptionResult.error}
      />
    );
  }

  return <SubscriptionSuccessClient subscription={subscriptionResult.data} />;
};

export default SubscriptionSuccessPage;
