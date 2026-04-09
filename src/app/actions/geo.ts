'use server';

import { headers } from 'next/headers';

/**
 * Detects the visitor's country code using ip-api.com on the server side.
 */
export async function getDetectedCountryCode(): Promise<string | null> {
  try {
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '';

    // Query specifically for the client's IP, not the server's IP
    const url = `http://ip-api.com/json/${ip}?fields=countryCode`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.countryCode || null;
  } catch (error) {
    console.error('Server-side geo-detection failed:', error);
    return null;
  }
}
