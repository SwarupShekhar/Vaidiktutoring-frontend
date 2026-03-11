/**
 * Load Razorpay checkout script
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="razorpay"]');
    if (existingScript) {
      // Script is loading, wait for it
      const checkRazorpay = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkRazorpay);
          resolve(true);
        }
      }, 100);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('[Razorpay] Loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('[Razorpay] Failed to load');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout modal
 */
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
}

export const openRazorpayCheckout = (options: RazorpayOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay not loaded'));
      return;
    }

    const rzp = new window.Razorpay({
      ...options,
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled'));
        },
      },
      handler: options.handler,
    });

    rzp.open();
  });
};
