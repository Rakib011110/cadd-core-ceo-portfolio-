import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

// This is an example of a server-side sitemap
// You can use this if you have dynamic content that needs to be included in the sitemap

export async function getServerSideProps(ctx: any) {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')

  const fields: ISitemapField[] = [
    {
      loc: 'https://www.hachnayen.com', // Engr. Hachnayen Ahmed's domain
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: 'https://www.hachnayen.com/about', // About Engr. Hachnayen Ahmed
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: 'https://www.hachnayen.com/courses', // BIM & AutoCAD courses
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: 'https://www.hachnayen.com/videos', // Training videos
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    },
    // Add more static pages as needed
  ]

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default function Sitemap() {}
