import { Suspense } from "react";
import { notFound } from "next/navigation";
import SuccessPageClient from "@/components/SuccessPageClient";

const SuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const sessionId = (await searchParams).session_id;

  if (!sessionId) {
    notFound();
  }

  return (
    <Suspense
      fallback={<div className="text-center p-8">Loading order details...</div>}
    >
      <SuccessPageClient sessionId={sessionId} />
    </Suspense>
  );
};

export default SuccessPage;
