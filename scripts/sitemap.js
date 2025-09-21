#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const domain = process.env.SITE_ORIGIN || 'https://snowb.org'
const buildDir = path.join(process.cwd(), 'build')

function collectHtmlFiles(dir) {
  const result = []
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    for (const entry of fs.readdirSync(cur)) {
      const full = path.join(cur, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) stack.push(full)
      else if (entry.toLowerCase() === 'index.html') {
        result.push(full)
      }
    }
  }
  return result
}

function pathToUrl(file) {
  const rel = path.relative(buildDir, file)
  const urlPath = '/' + rel.replace(/index\.html$/, '')
  return domain.replace(/\/$/, '') + urlPath
}

function getPriority(url, domain) {
  const urlPath = url.replace(domain, '')

  // Root page has highest priority
  if (urlPath === '' || urlPath === '/') {
    return '1.0'
  }

  // Language home pages (/{lang}/)
  if (/^\/[a-z]{2}(-[a-z]{2})?\/$/i.test(urlPath)) {
    return '0.9'
  }

  // Documentation home pages (/{lang}/docs/)
  if (/^\/[a-z]{2}(-[a-z]{2})?\/docs\/$/i.test(urlPath)) {
    return '0.8'
  }

  // All other documentation pages (/{lang}/docs/...)
  if (/^\/[a-z]{2}(-[a-z]{2})?\/docs\//i.test(urlPath)) {
    return '0.7'
  }

  // Default priority for other pages
  return '0.5'
}

function generateSitemap(urls) {
  const items = urls
    .sort()
    .map(
      (u) => `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${getPriority(u, domain)}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
}

if (!fs.existsSync(buildDir)) {
  console.error('Build directory not found')
  process.exit(1)
}

const htmls = collectHtmlFiles(buildDir)
const urls = htmls.map(pathToUrl)
fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), generateSitemap(urls))
console.log('sitemap.xml generated with', urls.length, 'urls')
