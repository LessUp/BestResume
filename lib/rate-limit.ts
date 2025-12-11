interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs: number;
}

interface AttemptRecord {
    count: number;
    firstAttempt: number;
    blockedUntil?: number;
}

export class RateLimiter {
    private store: Map<string, AttemptRecord>;
    private config: RateLimitConfig;

    constructor(config: RateLimitConfig) {
        this.store = new Map();
        this.config = config;
    }

    /**
     * Check if an identifier is currently blocked
     * @param identifier - IP address or user identifier
     * @returns Object with allowed status and optional retryAfter time
     */
    async checkLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
        const now = Date.now();
        const record = this.store.get(identifier);

        if (!record) {
            return { allowed: true };
        }

        // Check if currently blocked
        if (record.blockedUntil && record.blockedUntil > now) {
            const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
            return { allowed: false, retryAfter };
        }

        // Check if window has expired
        if (now - record.firstAttempt > this.config.windowMs) {
            // Window expired, reset
            this.store.delete(identifier);
            return { allowed: true };
        }

        // Check if attempts exceed limit
        if (record.count >= this.config.maxAttempts) {
            // Block the identifier
            record.blockedUntil = now + this.config.blockDurationMs;
            const retryAfter = Math.ceil(this.config.blockDurationMs / 1000);
            return { allowed: false, retryAfter };
        }

        return { allowed: true };
    }

    /**
     * Record an attempt (success or failure)
     * @param identifier - IP address or user identifier
     * @param success - Whether the attempt was successful
     */
    async recordAttempt(identifier: string, success: boolean): Promise<void> {
        const now = Date.now();
        const record = this.store.get(identifier);

        if (success) {
            // Successful attempt - clear the record
            this.store.delete(identifier);
            return;
        }

        // Failed attempt
        if (!record) {
            // First failed attempt
            this.store.set(identifier, {
                count: 1,
                firstAttempt: now,
            });
        } else {
            // Check if window has expired
            if (now - record.firstAttempt > this.config.windowMs) {
                // Window expired, start new window
                this.store.set(identifier, {
                    count: 1,
                    firstAttempt: now,
                });
            } else {
                // Increment count within window
                record.count++;
            }
        }
    }

    /**
     * Reset attempts for an identifier
     * @param identifier - IP address or user identifier
     */
    async reset(identifier: string): Promise<void> {
        this.store.delete(identifier);
    }

    /**
     * Get current attempt count for an identifier
     * @param identifier - IP address or user identifier
     * @returns Current attempt count
     */
    getAttemptCount(identifier: string): number {
        const record = this.store.get(identifier);
        if (!record) return 0;

        const now = Date.now();
        // Check if window has expired
        if (now - record.firstAttempt > this.config.windowMs) {
            return 0;
        }

        return record.count;
    }
}
