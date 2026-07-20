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
          // optional: show message here (toast)
          // window.location.href = '/login';
          // window.location.href = '/login'; // Force redirect to refresh session
        }
      } catch { }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default api;