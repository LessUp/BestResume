import { headers } from "next/headers";

export interface RequestContext {
    ipAddress: string;
    userAgent: string;
}

/**
 * Extract request context information from Next.js headers
 * Returns IP address and user agent for logging purposes
 */
export async function getRequestContext(): Promise<RequestContext> {
    try {
        const headersList = await headers();

        // Extract IP address from various possible headers
        const ipAddress =
            headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
            headersList.get("x-real-ip") ||
            "unknown";

        // Extract user agent
        const userAgent = headersList.get("user-agent") || "unknown";

        return {
            ipAddress,
            userAgent,
        };
    } catch (error) {
        // If headers are unavailable (e.g., in non-request context), return defaults
        return {
            ipAddress: "unknown",
            userAgent: "unknown",
        };
    }
}
