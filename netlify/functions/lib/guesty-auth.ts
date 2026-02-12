import { tokenCache } from './token-cache';

const CACHE_KEY = 'guesty_access_token';

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getGuestyAccessToken(): Promise<string> {
    // Check cache first
    const cachedToken = tokenCache.get(CACHE_KEY);
    if (cachedToken) {
        console.log('Using cached Guesty token');
        return cachedToken;
    }

    // No cached token, fetch a new one with retries
    console.log('Fetching new Guesty token...');

    const clientId = process.env.GUESTY_CLIENT_ID;
    const clientSecret = process.env.GUESTY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Guesty credentials not configured');
    }

    let retries = 3;
    let lastError: any;

    while (retries > 0) {
        try {
            const response = await fetch('https://open-api.guesty.com/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: clientId,
                    client_secret: clientSecret,
                    scope: 'open-api',
                }),
            });

            if (response.status === 429) {
                console.log('Rate limited fetching token, waiting...');
                await delay(2000); // Wait 2 seconds
                retries--;
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Guesty auth error response:', errorText);
                throw new Error(`Failed to authenticate: ${response.status}`);
            }

            const data = await response.json();
            console.log('Successfully authenticated with Guesty');

            // Cache the token
            const expiresIn = data.expires_in || 3600;
            tokenCache.set(CACHE_KEY, data.access_token, expiresIn);

            return data.access_token;
        } catch (error) {
            console.error(`Auth attempt failed (${retries} retries left):`, error);
            lastError = error;
            retries--;
            if (retries > 0) await delay(Math.pow(2, 3 - retries) * 1000); // 1s, 2s, 4s...
        }
    }

    const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown error';
    throw new Error(`Failed to authenticate after retries. Last error: ${errorMessage}`);
}
