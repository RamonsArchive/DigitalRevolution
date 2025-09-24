import SuccessPageClient from "@/components/SuccessPageClient";
import React from "react";

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const sessionId = (await searchParams).session_id;
  return <SuccessPageClient sessionId={sessionId} />;
};

export default SuccessPage;
