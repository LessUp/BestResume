import crypto from "crypto";

/**
 * Hash a token using SHA-256
 * @param token - The plain text token to hash
 * @returns The hashed token as a hex string
 */
export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Verify if a plain token matches a hashed token
 * @param plainToken - The plain text token to verify
 * @param hashedToken - The hashed token to compare against
 * @returns True if the tokens match, false otherwise
 */
export function verifyToken(plainToken: string, hashedToken: string): boolean {
    const hash = hashToken(plainToken);
    return hash === hashedToken;
}

/**
 * Generate a random token
 * @param bytes - Number of random bytes to generate (default: 32)
 * @returns A random token as a hex string
 */
export function generateToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
}
