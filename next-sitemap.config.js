/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.hachnayen.com', // Engr. Hachnayen Ahmed's domain
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  // Additional paths to include
  additionalPaths: async (config) => {
    const result = []
    
    // Add any additional dynamic paths here
    // For example, if you have BIM courses or AutoCAD tutorials with dynamic routes
    // result.push(await config.transform(config, '/courses/bim-modeling'))
    // result.push(await config.transform(config, '/courses/autocad-training'))
    
    return result
  },
  // Exclude certain paths
  exclude: [
    '/login',
    '/dashboard',
    '/dashboard/*',
    '/api/*', // Exclude API routes
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/api/'],
      },
    ],
    additionalSitemaps: [
      // Add additional sitemaps if needed
      // 'https://www.hachnayen.com/server-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom transformation for specific paths
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
