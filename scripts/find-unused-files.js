#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Parse command line arguments
const args = process.argv.slice(2)
const options = {
  cleanup: args.includes('--cleanup') || args.includes('-c'),
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  help: args.includes('--help') || args.includes('-h'),
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
🔍 Unused Files Detection and Cleanup Tool

Usage:
  node scripts/find-unused-files.js [options]

Options:
  -h, --help      Show help information
  -c, --cleanup   Clean up unused files
  -d, --dry-run   Simulate cleanup (use with --cleanup, doesn't actually delete files)
  -f, --force     Force execution in non-interactive environment (skip confirmation)

Examples:
  node scripts/find-unused-files.js                    # Analyze and report only
  node scripts/find-unused-files.js --cleanup          # Analyze and clean up files
  node scripts/find-unused-files.js --cleanup --dry-run # Simulate cleanup (safe)

Important Notes:
  ⚠️  Please carefully review the file list before cleanup
  ⚠️  It's recommended to use --dry-run parameter for testing first
  ⚠️  After cleanup, run tests to ensure the project works correctly
`)
  process.exit(0)
}

// Project configuration
const SRC_DIR = path.join(dirname, '..', 'src')
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const ENTRY_FILES = [
  'src/index.tsx',
  'src/App.tsx',
  'src/service-worker.ts',
  'src/serviceWorkerRegistration.ts',
  'src/setupTests.ts',
  'src/vite-env.d.ts',
]

// Path alias configuration
const PATH_ALIASES = {
  '@/': 'src/',
  '@/components': 'src/components',
  '@/store': 'src/store',
  '@/utils': 'src/utils',
  'src/': 'src/',
}

/**
 * Get all source files
 */
function getAllSourceFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(path.join(dirname, '..'), fullPath)

    if (entry.isDirectory()) {
      getAllSourceFiles(fullPath, files)
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(relativePath.replace(/\\/g, '/'))
    }
  }

  return files
}

/**
 * Parse import statements in files
 */
function parseImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const imports = new Set()

    // Match various import statements
    const importPatterns = [
      // import xxx from 'path'
      /import\s+[^'"]*['"]([^'"?]+)(?:\?[^'"]*)?['"]/g,
      // import('path') dynamic import
      /import\s*\(\s*['"]([^'"?]+)(?:\?[^'"]*)?['"]\s*\)/g,
      // require('path')
      /require\s*\(\s*['"]([^'"?]+)(?:\?[^'"]*)?['"]\s*\)/g,
      // export { xxx } from 'path'
      /export\s+[^'"]*from\s+['"]([^'"?]+)(?:\?[^'"]*)?['"]/g,
      // export * from 'path'
      /export\s+\*\s+from\s+['"]([^'"?]+)(?:\?[^'"]*)?['"]/g,
    ]

    for (const pattern of importPatterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const importPath = match[1]
        // Only handle relative paths and internal modules
        if (
          importPath.startsWith('.') ||
          importPath.startsWith('src') ||
          importPath.startsWith('@/')
        ) {
          imports.add(importPath)
        }
      }
    }

    return imports
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message)
    return new Set()
  }
}

/**
 * Resolve import path to actual file path
 */
function resolveImportPath(importPath, fromFile) {
  const fromDir = path.dirname(fromFile)
  let resolvedPath = importPath

  // Handle path aliases
  for (const [alias, actualPath] of Object.entries(PATH_ALIASES)) {
    if (importPath.startsWith(alias)) {
      resolvedPath = importPath.replace(alias, actualPath + '/')
      break
    }
  }

  // Handle relative paths
  if (resolvedPath.startsWith('.')) {
    resolvedPath = path.join(fromDir, resolvedPath).replace(/\\/g, '/')
  }

  // Normalize path
  resolvedPath = path.normalize(resolvedPath).replace(/\\/g, '/')

  // Try to resolve file extensions
  const possiblePaths = []

  // If extension already exists
  if (EXTENSIONS.includes(path.extname(resolvedPath))) {
    possiblePaths.push(resolvedPath)
  } else {
    // Try adding extensions
    for (const ext of EXTENSIONS) {
      possiblePaths.push(resolvedPath + ext)
    }

    // Try index files
    for (const ext of EXTENSIONS) {
      possiblePaths.push(
        path.join(resolvedPath, 'index' + ext).replace(/\\/g, '/'),
      )
    }
  }

  // Return existing file path
  const projectRoot = path.join(dirname, '..')
  for (const possiblePath of possiblePaths) {
    const fullPath = path.join(projectRoot, possiblePath)
    if (fs.existsSync(fullPath)) {
      return possiblePath
    }
  }

  return null
}

/**
 * Build dependency graph
 */
function buildDependencyGraph(sourceFiles) {
  const graph = new Map()
  const referencedFiles = new Set()

  // Entry files are always considered referenced
  for (const entryFile of ENTRY_FILES) {
    referencedFiles.add(entryFile)
  }

  // First mark all .d.ts files associated with corresponding .js files
  for (const file of sourceFiles) {
    if (file.endsWith('.d.ts')) {
      const jsFile = file.replace('.d.ts', '.js')
      if (sourceFiles.includes(jsFile)) {
        // If the corresponding .js file is referenced, then the .d.ts file is also referenced
        // This relationship will be established in the analysis below
      }
    }
  }

  // Analyze imports for each file
  for (const file of sourceFiles) {
    const fullPath = path.join(dirname, '..', file)
    const imports = parseImports(fullPath)
    const resolvedImports = new Set()

    for (const importPath of imports) {
      const resolved = resolveImportPath(importPath, file)
      if (resolved && sourceFiles.includes(resolved)) {
        resolvedImports.add(resolved)
        referencedFiles.add(resolved)

        // If importing a .js file, also mark the corresponding .d.ts file as referenced
        if (resolved.endsWith('.js')) {
          const dtsFile = resolved.replace('.js', '.d.ts')
          if (sourceFiles.includes(dtsFile)) {
            referencedFiles.add(dtsFile)
          }
        }
      }
    }

    graph.set(file, resolvedImports)
  }

  return { graph, referencedFiles }
}

/**
 * Clean up unused files
 */
function cleanupFiles(unusedFiles, dryRun = false) {
  if (unusedFiles.length === 0) {
    console.log('✅ No files to cleanup!')
    return { deleted: 0, errors: [] }
  }

  console.log(
    `\n🧹 ${dryRun ? 'Simulating cleanup' : 'Cleaning up'} ${unusedFiles.length} unused files...`,
  )
  console.log('='.repeat(50))

  const results = { deleted: 0, errors: [] }
  const projectRoot = path.join(dirname, '..')

  for (const file of unusedFiles.sort()) {
    const fullPath = path.join(projectRoot, file)

    try {
      if (dryRun) {
        console.log(`🗑️  Would delete: ${file}`)
        results.deleted++
      } else {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
          console.log(`✅ Deleted: ${file}`)
          results.deleted++
        } else {
          console.log(`⚠️  Not found: ${file}`)
        }
      }
    } catch (error) {
      const errorMsg = `Failed to delete ${file}: ${error.message}`
      console.log(`❌ ${errorMsg}`)
      results.errors.push(errorMsg)
    }
  }

  console.log('\n📈 Cleanup Results:')
  console.log(
    `   ${dryRun ? 'Would delete' : 'Deleted'}: ${results.deleted} files`,
  )
  if (results.errors.length > 0) {
    console.log(`   Errors: ${results.errors.length}`)
    for (const error of results.errors) {
      console.log(`     - ${error}`)
    }
  }

  if (!dryRun && results.deleted > 0) {
    console.log('\n⚠️  Recommended to run the following commands to check project status:')
    console.log('   yarn lint && yarn build && yarn test')
  }

  return results
}

/**
 * User confirmation
 */
async function getUserConfirmation(unusedFiles) {
  if (unusedFiles.length === 0) return true

  console.log(`\n⚠️  About to delete ${unusedFiles.length} files!`)
  console.log('Please confirm that you have:')
  console.log('  ✓ Carefully reviewed the file list')
  console.log('  ✓ Confirmed these files are indeed unused')
  console.log('  ✓ Made code backups')

  // In non-interactive environment, user must explicitly pass --force parameter
  if (!process.stdin.isTTY) {
    const hasForce = args.includes('--force') || args.includes('-f')
    if (!hasForce) {
      console.log('\n❌ --force parameter required for deletion confirmation in non-interactive environment')
      process.exit(1)
    }
    return true
  }

  // Simple confirmation mechanism
  console.log('\nContinue with deletion? Type "yes" to confirm:')
  try {
    const { default: readline } = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      rl.question('> ', (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === 'yes')
      })
    })
  } catch {
    console.log('❌ Cannot get user input, operation cancelled')
    return false
  }
}

/**
 * Find unreferenced files
 */
function findUnusedFiles() {
  console.log('🔍 Scanning for unused files in src/ directory...\n')

  // Get all source files
  const sourceFiles = getAllSourceFiles(SRC_DIR)
  console.log(`📁 Found ${sourceFiles.length} source files`)

  // Build dependency graph
  const { referencedFiles } = buildDependencyGraph(sourceFiles)

  // Find unreferenced files
  const unusedFiles = sourceFiles.filter((file) => !referencedFiles.has(file))

  // Output results
  console.log('\n📊 Analysis Results:')
  console.log('='.repeat(50))

  if (unusedFiles.length === 0) {
    console.log('✅ No unused files found! All files are referenced.')
  } else {
    console.log(`❌ Found ${unusedFiles.length} unused files:\n`)

    // Display grouped by directory
    const groupedFiles = {}
    for (const file of unusedFiles) {
      const dir = path.dirname(file)
      if (!groupedFiles[dir]) {
        groupedFiles[dir] = []
      }
      groupedFiles[dir].push(path.basename(file))
    }

    for (const [dir, files] of Object.entries(groupedFiles)) {
      console.log(`📂 ${dir}/`)
      for (const file of files.sort()) {
        console.log(`   - ${file}`)
      }
      console.log()
    }

    // Output statistics
    console.log('📈 Statistics:')
    console.log(`   Total files: ${sourceFiles.length}`)
    console.log(`   Referenced files: ${referencedFiles.size}`)
    console.log(`   Unused files: ${unusedFiles.length}`)
    console.log(
      `   Usage rate: ${((referencedFiles.size / sourceFiles.length) * 100).toFixed(1)}%`,
    )

    // Generate report file
    const reportPath = path.join(dirname, '..', 'unused-files-report.json')
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: sourceFiles.length,
      referencedFiles: referencedFiles.size,
      unusedFiles: unusedFiles.length,
      usageRate:
        ((referencedFiles.size / sourceFiles.length) * 100).toFixed(1) + '%',
      unusedFilesList: unusedFiles.sort(),
      entryFiles: ENTRY_FILES,
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📋 Detailed report saved to: ${reportPath}`)
  }

  return unusedFiles
}

// Run script
if (import.meta.url === `file://${filename}`) {
  async function main() {
    try {
      // Show help
      if (options.help) {
        showHelp()
      }

      // Find unused files
      const unusedFiles = findUnusedFiles()

      // If cleanup is needed
      if (options.cleanup) {
        if (options.dryRun) {
          // Simulate cleanup
          cleanupFiles(unusedFiles, true)
        } else {
          // Actual cleanup requires confirmation
          const confirmed = await getUserConfirmation(unusedFiles)
          if (confirmed) {
            const results = cleanupFiles(unusedFiles, false)
            if (results.deleted > 0) {
              console.log('\n✅ Cleanup completed! Please run tests to ensure the project works correctly.')
            }
          } else {
            console.log('\n❌ Operation cancelled by user')
            process.exit(1)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }
  }

  main()
}

export { findUnusedFiles }
