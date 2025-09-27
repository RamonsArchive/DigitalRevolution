import React from "react";
import { PARTNERS_DATA } from "@/constants";
import PartnersPageClient from "@/components/PartnersPageClient";

const PartnersPage = () => {
  const partnersData = PARTNERS_DATA;
  return <PartnersPageClient partnersData={partnersData} />;
};

export default PartnersPage;
