"use server";
import { checkRateLimit } from "./rateLimiter";
import { parseServerActionResponse } from "./utils";
export const getProductsAndFilters = async () => {
    try {

        const isRateLimited = await checkRateLimit("getProductsAndFilters");
        if (isRateLimited) {
            isRateLimited;
        }
        return parseServerActionResponse({
            status: "SUCCESS",
            error: "",
            data: null,
        })

    } catch (error) {
        console.error(error);
        return parseServerActionResponse({
            status: "ERROR",
            error: error,
            data: null,
        })
    }
    
}