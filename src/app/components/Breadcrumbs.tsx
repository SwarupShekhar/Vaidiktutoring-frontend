'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customLabels?: Record<string, string>;
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter((v) => v.length > 0);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Check for custom labels or format the segment
    let label = customLabels[segment] || segment;
    
    // Basic formatting if no custom label exists
    if (!customLabels[segment]) {
      label = label
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Handle IDs (e.g., UUID-like strings)
      if (segment.length > 20) {
        label = 'Details';
      }
    }

    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-gray-400 dark:text-white/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link 
        href="/" 
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <Home size={12} />
        <span>Home</span>
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight size={12} className="text-gray-300 dark:text-white/20 shrink-0" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{crumb.label}</span>
          ) : (
            <Link 
              href={crumb.href}
              className="hover:text-primary transition-colors truncate max-w-[150px]"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
