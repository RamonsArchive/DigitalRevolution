import { Suspense } from "react";
import { notFound } from "next/navigation";
import SuccessPageClient from "@/components/SuccessPageClient";

const SuccessPage = ({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) => {
  const sessionId = searchParams.session_id;

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
