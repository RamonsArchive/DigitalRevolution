import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { parseServerActionResponse } from "./utils";

export const rateLimiter = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(10, "30 s"), // Allow 10 requests per 10 seconds
  analytics: true,
});

export const clientRateLimiter = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(50, "10 s"), // Allow 10 requests per 10 seconds
  analytics: true,
});

export const getClientId = async () => {
  // Try session cookie first

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (userId) {
    return `session:${userId}`;
  } else {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
    const userAgent = headersList.get("user-agent");
    const acceptLanguage = headersList.get("accept-language");
    return `ip:${crypto.createHash("sha256")
      .update(`${ip}-${userAgent}-${acceptLanguage}`)
      .digest("hex")}`;

  }
};

export const checkRateLimit = async (functionToRateLimit: string) => {
  const clientId = await getClientId();
  const prefix = process.env.PROJECT_PREFIX;
  const { success } = await rateLimiter.limit(`${prefix}:${clientId}:${functionToRateLimit}`);
  if (!success) {
    return parseServerActionResponse({
      status: "ERROR",
      error: "Too many requests, please try again later",
      data: null,
    })
  }
  return parseServerActionResponse({
    status: "SUCCESS",
    error: "",
    data: null,
  });
}