// src/app/lib/api.ts
import axios, { AxiosError } from 'axios';

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://k-12-backend.onrender.com').replace(/\/$/, '');

console.log('[API] Connected to:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

/**
 * Helper to update token from AuthContext
 */
let authTokenPromise: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
  authTokenPromise = fn;
};

export const setAuthToken = (token: string | null) => {
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
  if (authTokenPromise) {
    try {
      const token = await authTokenPromise();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('[API] Failed to get fresh token', e);
    }
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
    const data: any = err?.response?.data;

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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // optional: show message here (toast)
          // window.location.href = '/login';
          // window.location.href = '/login'; // Force redirect to refresh session
          console.warn('401 Unauthorized - redirect DISABLED for debugging');
          console.warn('401 Unauthorized - would redirect to login');
        }
      } catch { }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default api;