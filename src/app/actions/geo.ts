'use server';

import { headers } from 'next/headers';

export async function getDetectedCountryCode(): Promise<string | null> {
  try {
    const headersList = await headers();

    // Vercel edge geo header — instant, zero network call
    const vercelCountry = headersList.get('x-vercel-ip-country');
    if (vercelCountry && vercelCountry !== 'XX') return vercelCountry;

    // Cloudflare geo header
    const cfCountry = headersList.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') return cfCountry;

    // Fallback: ip-api with 3s timeout and 1h cache
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '';
    if (!ip) return null;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch(
        `https://ip-api.com/json/${ip}?fields=countryCode`,
        { signal: controller.signal, next: { revalidate: 3600 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.countryCode || null;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}
