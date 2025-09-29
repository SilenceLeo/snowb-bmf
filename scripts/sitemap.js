#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const domain = process.env.SITE_ORIGIN || 'https://snowb.org'
const buildDir = path.join(process.cwd(), 'build')

// Detect available languages by scanning directories
function getAvailableLanguages() {
  const languages = []
  try {
    const entries = fs.readdirSync(buildDir)
    for (const entry of entries) {
      const fullPath = path.join(buildDir, entry)
      const stat = fs.statSync(fullPath)
      // Check if it's a directory and matches language code pattern
      if (stat.isDirectory() && /^[a-z]{2}(-[a-z]{2})?$/i.test(entry)) {
        languages.push(entry)
      }
    }
    // Also include root (default language)
    // languages.push('default')
  } catch (error) {
    console.warn('Error detecting languages:', error.message)
  }
  return languages
}

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

// Extract language and content path from URL
function parseUrl(url, domain) {
  const urlPath = url.replace(domain, '')

  // Check if URL starts with language code
  const langMatch = urlPath.match(/^\/([a-z]{2}(-[a-z]{2})?)\/(.*)$/)
  if (langMatch) {
    return {
      language: langMatch[1],
      contentPath: '/' + langMatch[3]
    }
  }

  // Root path should be treated separately (no language versions)
  if (urlPath === '' || urlPath === '/') {
    return {
      language: 'root',
      contentPath: '/'
    }
  }

  // Other default language pages
  return {
    language: 'default',
    contentPath: urlPath
  }
}

// Convert language code to proper hreflang format
function formatHreflang(langCode) {
  if (langCode === 'zh-cn') {
    return 'zh-CN'
  }
  return langCode
}

// Generate alternate language URLs for a given content path
function generateAlternateUrls(contentPath, availableLanguages, domain) {
  const alternates = []

  for (const lang of availableLanguages) {
    if (lang === 'default') {
      // Root language URL
      const url = domain.replace(/\/$/, '') + contentPath
      alternates.push({
        url: url,
        hreflang: 'x-default'
      })
    } else {
      // Specific language URL
      const url = domain.replace(/\/$/, '') + '/' + lang + contentPath
      alternates.push({
        url: url,
        hreflang: formatHreflang(lang)
      })
    }
  }

  return alternates
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

function generateSitemap(urls, availableLanguages) {
  // Group URLs by content path to generate alternates
  const contentGroups = new Map()

  for (const url of urls) {
    const { language, contentPath } = parseUrl(url, domain)

    if (!contentGroups.has(contentPath)) {
      contentGroups.set(contentPath, new Map())
    }

    contentGroups.get(contentPath).set(language, url)
  }

  const items = []

  // Process each content group
  for (const [contentPath, languageUrls] of contentGroups) {
    // Generate alternates for this content path
    const alternateUrls = generateAlternateUrls(contentPath, availableLanguages, domain)

    // Add URL entries for each language that exists
    for (const [language, url] of languageUrls) {
      let alternateSection = ''

      // Only add alternate links for non-root pages
      if (language !== 'root') {
        // Build alternate links (only include ones that actually exist)
        const alternateLinks = alternateUrls
          .filter(alt => {
            // Check if this alternate URL exists in our URL list
            const altParsed = parseUrl(alt.url, domain)
            return languageUrls.has(altParsed.language)
          })
          .map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.url}"/>`)
          .join('\n')

        alternateSection = alternateLinks ? '\n' + alternateLinks : ''
      }

      const item = `  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${getPriority(url, domain)}</priority>${alternateSection}\n  </url>`
      items.push(item)
    }
  }

  const sortedItems = items.sort().join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sortedItems}\n</urlset>\n`
}

if (!fs.existsSync(buildDir)) {
  console.error('Build directory not found')
  process.exit(1)
}

const availableLanguages = getAvailableLanguages()
const htmlFiles = collectHtmlFiles(buildDir)
const urls = htmlFiles.map(pathToUrl)

console.log('Detected languages:', availableLanguages)

fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), generateSitemap(urls, availableLanguages))
console.log('sitemap.xml generated with', urls.length, 'urls and multilingual support')
