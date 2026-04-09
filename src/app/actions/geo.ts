'use server';

/**
 * Detects the visitor's country code using ip-api.com on the server side.
 * This prevents Googlebot from discovering the URL in the client-side bundle,
 * which fixes the "Blocked by robots.txt" error in Search Console.
 */
export async function getDetectedCountryCode(): Promise<string | null> {
  try {
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      next: { revalidate: 3600 } // Cache for 1 hour to stay under rate limits
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.countryCode || null;
  } catch (error) {
    console.error('Server-side geo-detection failed:', error);
    return null;
  }
}
