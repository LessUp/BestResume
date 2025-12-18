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

 type UpstashCredentials = {
     url: string;
     token: string;
 };

 type UpstashRateLimiterConfig = RateLimitConfig & {
     prefix?: string;
 };

 export class UpstashRateLimiter {
     private config: UpstashRateLimiterConfig;
     private credentials: UpstashCredentials;
     private prefix: string;

     constructor(config: UpstashRateLimiterConfig) {
         const credentials = getUpstashCredentials();
         if (!credentials) {
             throw new Error("Upstash credentials are not configured");
         }

         this.credentials = credentials;
         this.config = config;
         this.prefix = config.prefix ?? "rate_limit";
     }

     async checkLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
         try {
             const blockKey = this.getBlockKey(identifier);
             const blocked = await upstashCommand<string | null>(this.credentials, ["GET", blockKey]);

             if (blocked) {
                 const ttl = await upstashCommand<number>(this.credentials, ["TTL", blockKey]);
                 const retryAfter = ttl > 0 ? ttl : Math.ceil(this.config.blockDurationMs / 1000);
                 return { allowed: false, retryAfter };
             }

             const attemptsKey = this.getAttemptsKey(identifier);
             const countRaw = await upstashCommand<string | null>(this.credentials, ["GET", attemptsKey]);
             const count = countRaw ? Number.parseInt(countRaw, 10) : 0;

             if (Number.isFinite(count) && count >= this.config.maxAttempts) {
                 const blockSeconds = Math.max(Math.ceil(this.config.blockDurationMs / 1000), 1);
                 await upstashCommand(this.credentials, ["SET", blockKey, "1", "EX", blockSeconds]);
                 return { allowed: false, retryAfter: blockSeconds };
             }

             return { allowed: true };
         } catch (err) {
             console.warn("Upstash rate limit check failed:", err);
             return { allowed: true };
         }
     }

     async recordAttempt(identifier: string, success: boolean): Promise<void> {
         try {
             const attemptsKey = this.getAttemptsKey(identifier);
             const blockKey = this.getBlockKey(identifier);

             if (success) {
                 await upstashCommand(this.credentials, ["DEL", attemptsKey, blockKey]);
                 return;
             }

             const count = await upstashCommand<number>(this.credentials, ["INCR", attemptsKey]);
             if (count === 1) {
                 const windowSeconds = Math.max(Math.ceil(this.config.windowMs / 1000), 1);
                 await upstashCommand(this.credentials, ["EXPIRE", attemptsKey, windowSeconds]);
             }
         } catch (err) {
             console.warn("Upstash rate limit record failed:", err);
         }
     }

     async reset(identifier: string): Promise<void> {
         try {
             await upstashCommand(this.credentials, [
                 "DEL",
                 this.getAttemptsKey(identifier),
                 this.getBlockKey(identifier),
             ]);
         } catch (err) {
             console.warn("Upstash rate limit reset failed:", err);
         }
     }

     async getAttemptCount(identifier: string): Promise<number> {
         try {
             const countRaw = await upstashCommand<string | null>(
                 this.credentials,
                 ["GET", this.getAttemptsKey(identifier)]
             );
             const count = countRaw ? Number.parseInt(countRaw, 10) : 0;
             return Number.isFinite(count) ? count : 0;
         } catch (err) {
             console.warn("Upstash rate limit getAttemptCount failed:", err);
             return 0;
         }
     }

     private getAttemptsKey(identifier: string) {
         return `${this.prefix}:attempts:${identifier}`;
     }

     private getBlockKey(identifier: string) {
         return `${this.prefix}:blocked:${identifier}`;
     }
 }

 function getUpstashCredentials(): UpstashCredentials | null {
     const url =
         process.env.UPSTASH_REDIS_REST_URL ??
         process.env.UPSTASH_KV_REST_API_URL ??
         process.env.KV_REST_API_URL ??
         null;

     const token =
         process.env.UPSTASH_REDIS_REST_TOKEN ??
         process.env.UPSTASH_KV_REST_API_TOKEN ??
         process.env.KV_REST_API_TOKEN ??
         null;

     if (!url || !token) return null;
     return { url, token };
 }

 async function upstashCommand<T>(
     credentials: UpstashCredentials,
     command: Array<string | number>
 ): Promise<T> {
     const res = await fetch(credentials.url, {
         method: "POST",
         headers: {
             Authorization: `Bearer ${credentials.token}`,
             "Content-Type": "application/json",
         },
         body: JSON.stringify(command),
     });

     const data = (await res.json()) as { result?: T; error?: string };
     if (!res.ok || data.error) {
         throw new Error(data.error ?? `Upstash error (${res.status})`);
     }
     return data.result as T;
 }
