import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hachnayen.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Add more routes as needed
    // You can also fetch dynamic routes here
    // ...await getDynamicRoutes()
  ]
}

// Uncomment and implement if you have dynamic routes
// async function getDynamicRoutes() {
//   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
//   
//   try {
//     // Fetch your dynamic content (blogs, courses, etc.)
//     // const blogs = await fetch(`${baseUrl}/api/blogs`).then(res => res.json())
//     // const courses = await fetch(`${baseUrl}/api/courses`).then(res => res.json())
//     
//     const dynamicRoutes = []
//     
//     // Add blog routes
//     // blogs.forEach((blog: any) => {
//     //   dynamicRoutes.push({
//     //     url: `${baseUrl}/blog/${blog.slug}`,
//     //     lastModified: new Date(blog.updatedAt),
//     //     changeFrequency: 'monthly',
//     //     priority: 0.6,
//     //   })
//     // })
//     
//     return dynamicRoutes
//   } catch (error) {
//     console.error('Error generating dynamic sitemap routes:', error)
//     return []
//   }
// }
