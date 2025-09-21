#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const appBuild = path.join(root, 'build')
const siteDist = path.join(root, 'site', 'dist')

const excludeAtRoot = new Set([
  'index.html',
  'manifest.json',
  'favicon.ico',
  'favicon.png',
  'robots.txt',
  'service-worker.js',
  'service-worker.js.map',
  'sw.js',
])

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    ensureDir(dest)
    for (const entry of fs.readdirSync(src)) {
      const s = path.join(src, entry)
      const d = path.join(dest, entry)
      copyRecursive(s, d)
    }
  } else {
    const relative = path.relative(siteDist, src)
    const isRootFile = !relative.includes(path.sep)
    if (isRootFile && excludeAtRoot.has(relative)) return

    if (fs.existsSync(dest)) return
    ensureDir(path.dirname(dest))
    fs.copyFileSync(src, dest)
  }
}

if (!fs.existsSync(siteDist)) {
  console.error('Site dist not found, please run "yarn build:site" first')
  process.exit(1)
}
ensureDir(appBuild)
copyRecursive(siteDist, appBuild)
console.log('Merged site/dist into build successfully')
