// src/app/lib/api.ts
import axios, { AxiosError } from 'axios';

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.studyhours.com').replace(/\/$/, '');



// Add better error handling for network issues
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 30000, // 30 seconds to handle cold starts and heavy CMS/Sanity queries
});

/**
 * Helper to update token from AuthContext
 */
let authTokenPromise: (() => Promise<string | null>) | null = null;
let cachedAuthToken: string | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  authTokenPromise = fn;
};

export const setAuthToken = (token: string | null) => {
  cachedAuthToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ---- Sliding-session refresh for the manual/backend-JWT path ----
// Clerk auto-refreshes its own tokens; manual-login users hold a static stored
// JWT that used to expire mid-session (1d expiry, no refresh) -> 401s + dropped
// socket. This getter swaps the token for a fresh one via /auth/refresh once it
// enters the refresh window while still valid, so an active session slides
// forward instead of dying. Registered as the token getter for manual users.
const MANUAL_REFRESH_WINDOW_SECONDS = 15 * 60; // refresh when <15min from expiry
let manualRefreshInFlight: Promise<string | null> | null = null;

const decodeJwtExp = (jwt: string): number | null => {
  try {
    const b64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
};

// Entry-time guard: is there a usable (non-expired) auth token right now?
// Calls the registered getter, which for Clerk auto-refreshes and for manual
// users slides the token forward if it's within the refresh window. Returns
// 'expired' only when we end up with no token or a still-expired one — the
// signal to send the user through a clean re-login instead of letting them
// limp into a session on a dead token (can't join / socket rejected / no sync).
export const ensureValidToken = async (): Promise<'ok' | 'expired'> => {
  if (!authTokenPromise) return 'expired';
  const token = await getFreshAuthToken();
  if (!token) return 'expired';
  const exp = decodeJwtExp(token);
  if (exp !== null && exp <= Date.now() / 1000) return 'expired';
  return 'ok';
};

export const getManualAuthToken = async (): Promise<string | null> => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem('auth_token');
  } catch {
    return null;
  }
  if (!stored) return null;

  const exp = decodeJwtExp(stored);
  const now = Date.now() / 1000;
  // Already expired, or no exp claim, or not near expiry -> hand back as-is.
  // (An expired token can't be refreshed; the 401 interceptor handles re-login.)
  if (!exp || exp <= now || exp - now > MANUAL_REFRESH_WINDOW_SECONDS) {
    return stored;
  }

  // Within the window and still valid -> refresh once, deduping concurrent callers.
  // Uses raw axios (not `api`) so it bypasses the interceptor and can't recurse.
  if (!manualRefreshInFlight) {
    manualRefreshInFlight = axios
      .post<{ token?: string }>(`${API_URL}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((res) => {
        const fresh = res.data?.token;
        if (fresh) {
          try { localStorage.setItem('auth_token', fresh); } catch { /* ignore */ }
          setAuthToken(fresh);
          return fresh;
        }
        return stored;
      })
      .catch(() => stored)
      .finally(() => { manualRefreshInFlight = null; });
  }
  return manualRefreshInFlight;
};

export const getAuthToken = () => cachedAuthToken;

export const getFreshAuthToken = async (): Promise<string | null> => {
  if (authTokenPromise) {
    try {
      const token = await authTokenPromise();
      if (token) {
        cachedAuthToken = token;
      }
      return token || cachedAuthToken;
    } catch (e) {
      return cachedAuthToken;
    }
  }
  return cachedAuthToken;
};

/**
 * Request interceptor - ensures token is fresh if getter is provided
 */
api.interceptors.request.use(async (config) => {
  // If a token getter function is registered (e.g. Clerk's getToken or manual local storage getter),
  // always query it first to ensure we get a fresh, unexpired token.
  if (authTokenPromise) {
    try {
      const token = await authTokenPromise();
      if (token) {
        cachedAuthToken = token;
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      } else {
        cachedAuthToken = null;
        delete config.headers['Authorization'];
      }
    } catch (err) {
      console.error('[API Interceptor] Failed to fetch token via getter:', err);
      cachedAuthToken = null;
      delete config.headers['Authorization'];
    }
  }

  // Fallback to cached token if the getter is not available (only if authTokenPromise is not set)
  if (!authTokenPromise && cachedAuthToken) {
    config.headers['Authorization'] = `Bearer ${cachedAuthToken}`;
  }
  return config;
});

/**
 * Response interceptor -> handle 401 centrally
 */
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    // If unauthorized, remove token and redirect to login
    const status = err?.response?.status;
    const data = err?.response?.data as { message?: unknown } | undefined;

    // Check for specific 403 regarding verification
    // Match leniently: "verify" and "email"
    const msg = (typeof data?.message === 'string') ? data.message.toLowerCase() : '';
    if (status === 403 && (msg.includes('verify') && msg.includes('email'))) {
      // Emit event for AuthContext to pick up
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('k12:auth:verification_needed'));
      }
      return Promise.reject(err);
    }

    // Password Reset Required
    if (status === 403 && msg.includes('password') && (msg.includes('reset') || msg.includes('change')) && msg.includes('required')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/change-password';
      }
      return Promise.reject(err);
    }



    if (status === 401) {
      try {
        cachedAuthToken = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // Prevent redirect loops if we're already on login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = `/login?expired=true&redirect=${encodeURIComponent(window.location.pathname)}`;
          }
        }
      } catch { }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default api;