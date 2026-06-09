import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function(this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

export const optimizeCloudinaryUrl = (url: string): string => {
    if (url && url.includes("cloudinary.com") && !url.includes("f_auto")) {
        return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return url;
};
