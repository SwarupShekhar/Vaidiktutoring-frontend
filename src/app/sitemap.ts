import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.studyhours.com' // Replace with actual domain

  // We can programmatically generate this, but for now we list the core routes
  const routes = [
    '',
    '/pricing',
    '/k-12-online-tutoring',
    '/ib-online-tutoring',
    '/a-level-online-tutoring',
    '/gcse-online-tutoring',
    '/igcse-online-tutoring',
    '/singapore-jc-guide',
    '/subjects',
    '/about',
    '/contact',
    '/search',
    '/careers',
    '/us/sat-prep',
    '/us/act-prep',
    '/us/ap-tutoring',
    '/us/american-curriculum',
    '/australia',
    '/australia/qce-online-tutoring',
    '/australia/atar-online-tutoring',
    '/australia/curriculum-tutoring',
    '/australia/wace-online-tutoring',
    '/australia/hsc-online-tutoring',
    '/australia/vce-online-tutoring',
    '/singapore',
    '/singapore/a-level-tutors-singapore',
    '/singapore/o-level-tutors-singapore',
    '/singapore/ip-programme-tutors-singapore',
    '/singapore/psle-tutors-online',
    '/singapore/moe-singapore-curriculum-tutors',
    '/singapore/primary-school-tutors-singapore',
    '/uae',
    '/uae/physics-maths-tutor',
    '/uae/online-tutors-abu-dhabi',
    '/uae/moe-uae-curriculum-tutors',
    '/uae/online-tutors-dubai',
    '/saudi/saudi-ministry-curriculum-tutors',
    '/saudi/online-tutors-riyadh',
    '/online-tutoring-uk',
  ]
 
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
