import React from "react";
import { DONATE_DATA } from "@/constants";
import DonatePageClient from "@/components/DonatePageClient";
import { auth } from "../../../../auth";

const DonatePage = async () => {
  const session = await auth();
  const donateData = DONATE_DATA;
  return <DonatePageClient donateData={donateData} session={session} />;
};

export default DonatePage;
