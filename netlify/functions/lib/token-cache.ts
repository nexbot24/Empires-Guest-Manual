/**
 * Token cache to store Guesty OAuth tokens and reduce API calls
 * Tokens are cached in memory with expiration tracking
 */

interface CachedToken {
    accessToken: string;
    expiresAt: number; // Unix timestamp in milliseconds
}

class TokenCache {
    private cache: Map<string, CachedToken> = new Map();

    /**
     * Get a cached token if it exists and hasn't expired
     * @param key Cache key (e.g., 'guesty_token')
     * @returns The access token if valid, null otherwise
     */
    get(key: string): string | null {
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        // Check if token has expired (with 5 minute buffer for safety)
        const now = Date.now();
        const bufferMs = 5 * 60 * 1000; // 5 minutes

        if (now >= (cached.expiresAt - bufferMs)) {
            // Token expired or about to expire, remove it
            this.cache.delete(key);
            return null;
        }

        return cached.accessToken;
    }

    /**
     * Store a token in the cache
     * @param key Cache key (e.g., 'guesty_token')
     * @param accessToken The OAuth access token
     * @param expiresInSeconds How long the token is valid (in seconds)
     */
    set(key: string, accessToken: string, expiresInSeconds: number): void {
        const expiresAt = Date.now() + (expiresInSeconds * 1000);

        this.cache.set(key, {
            accessToken,
            expiresAt,
        });
    }

    /**
     * Clear a specific token from the cache
     * @param key Cache key to clear
     */
    clear(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Clear all tokens from the cache
     */
    clearAll(): void {
        this.cache.clear();
    }
}

// Export a singleton instance
export const tokenCache = new TokenCache();
