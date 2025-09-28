import React from "react";
import { getDonationByStripeSessionId } from "@/lib/actions";
import DonateSuccessClient from "@/components/DonateSuccessClient";

const DonateSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const stripeSessionId = (await searchParams).session_id;

  if (!stripeSessionId) {
    return (
      <DonateSuccessClient donation={null} error="No session ID provided" />
    );
  }

  const donationResult = await getDonationByStripeSessionId(stripeSessionId);

  if (donationResult.status === "ERROR") {
    return <DonateSuccessClient donation={null} error={donationResult.error} />;
  }

  return <DonateSuccessClient donation={donationResult.data} />;
};

export default DonateSuccessPage;
