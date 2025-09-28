import React from "react";
import { SHARE_DATA } from "@/constants";
import SharePageClient from "../../../components/SharePageClient";

const SharePage = () => {
  const shareData = SHARE_DATA;
  return <SharePageClient shareData={shareData} />;
};

export default SharePage;
