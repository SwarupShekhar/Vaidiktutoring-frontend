import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/api/', '/bookings/'],
    },
    sitemap: 'https://www.studyhours.com/sitemap.xml',
  }
}
