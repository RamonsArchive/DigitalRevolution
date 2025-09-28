import { getLatestSubscription } from "@/lib/actions";
import React from "react";
import { auth } from "../../../../../auth";
import SubscriptionSuccessClient from "../../../../components/SubscriptionSuccessClient";

const SubscriptionSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ sessionId: string }>;
}) => {
  const sessionId = (await searchParams).sessionId;
  const session = await auth();
  const userId = session?.user?.id || "";
  const subscription = await getLatestSubscription(userId);

  return <SubscriptionSuccessClient subscription={subscription.data} />;
};

export default SubscriptionSuccessPage;
