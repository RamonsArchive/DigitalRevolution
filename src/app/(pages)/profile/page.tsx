import React from "react";
import ProfilePageClient from "@/components/ProfilePageClient";
import { PROFILE_DATA } from "@/constants";
import { auth } from "../../../../auth";
import { getSubscription } from "@/lib/actions";
const ProfilePage = async () => {
  const session = await auth();
  const profileData = PROFILE_DATA;

  const subscriptions = (await getSubscription(session?.user?.id || "")).data;
  return (
    <ProfilePageClient
      profileData={profileData}
      subscriptions={subscriptions || []}
    />
  );
};

export default ProfilePage;
