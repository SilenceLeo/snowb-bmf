#!/usr/bin/env node
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import pbjs from 'protobufjs-cli/pbjs.js'
import pbts from 'protobufjs-cli/pbts.js'
import { promisify } from 'util'

const execAsync = promisify(exec)

const protoVersionsDir = path.join(
  process.cwd(),
  'src/file/conversion/fileTypes/sbf/proto',
)

async function generateProtocolBuffersForVersion(versionDir, version) {
  try {
    const protoFile = path.join(versionDir, 'project.proto')
    const jsFile = path.join(versionDir, 'project.js')
    const dtsFile = path.join(versionDir, 'project.d.ts')

    console.log(`Generating Protocol Buffer files for version ${version}...`)

    // Check if proto file exists
    try {
      await fs.access(protoFile)
    } catch {
      console.log(`Skipping ${version}: no project.proto file found`)
      return
    }

    // Generate JavaScript file
    const output = await new Promise((resolve, reject) => {
      pbjs.main(
        ['--target', 'static-module', protoFile, '-w', 'es6', '--es6'],
        function (err, output) {
          if (err) {
            reject(err)
          } else {
            resolve(output)
          }
        },
      )
    })

    // Write JavaScript file
    const processedOutput =
      '/* eslint-disable */\n' + output.replace(/\/\*[\s\S\w\W].*?\*\//, '')
    await fs.writeFile(jsFile, processedOutput)
    console.log(`Generated ${version}/project.js`)

    // Generate TypeScript definition file
    const outputDts = await new Promise((resolve, reject) => {
      pbts.main([jsFile], (err, outputDts) => {
        if (err) {
          reject(err)
        } else {
          resolve(outputDts)
        }
      })
    })

    await fs.writeFile(dtsFile, '/* eslint-disable */\n' + outputDts)
    console.log(`Generated ${version}/project.d.ts`)

    return { jsFile, dtsFile }
  } catch (error) {
    console.error(
      `Failed to generate Protocol Buffer files for ${version}:`,
      error,
    )
    return null
  }
}


async function generateAllProtocolBuffers() {
  try {
    console.log('Starting Protocol Buffer generation for all versions...')

    // Get all version directories
    const entries = await fs.readdir(protoVersionsDir, { withFileTypes: true })
    const versionDirs = entries
      .filter(
        (entry) => entry.isDirectory() && /^\d+\.\d+\.\d+$/.test(entry.name),
      )
      .sort((a, b) => {
        // Sort by version number
        const versionA = a.name.split('.').map(Number)
        const versionB = b.name.split('.').map(Number)
        for (let i = 0; i < 3; i++) {
          if (versionA[i] !== versionB[i]) {
            return versionA[i] - versionB[i]
          }
        }
        return 0
      })

    console.log(
      `Found ${versionDirs.length} version directories:`,
      versionDirs.map((d) => d.name),
    )

    // Generate protocol files for all versions
    const generatedFiles = []
    for (const versionDir of versionDirs) {
      const versionPath = path.join(protoVersionsDir, versionDir.name)
      const result = await generateProtocolBuffersForVersion(
        versionPath,
        versionDir.name,
      )
      if (result) {
        generatedFiles.push(result)
      }
    }


    // Format all generated files with Prettier
    console.log('Formatting generated files with Prettier...')
    const prettierPath = path.join(process.cwd(), 'node_modules/.bin/prettier')

    for (const result of generatedFiles) {
      // Version files
      const versionDir = path.dirname(result.jsFile)
      await execAsync(`${prettierPath} --write ${versionDir}/*.{ts,js}`)
      
      // Fix $root caching issue after formatting
      const jsContent = await fs.readFile(result.jsFile, 'utf8')
      const originalLine = "const $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {})"
      const replacementLine = 'const $root = {}'
      
      if (jsContent.includes(originalLine)) {
        const fixedContent = jsContent.replace(originalLine, replacementLine)
        await fs.writeFile(result.jsFile, fixedContent)
        console.log(`Fixed $root caching in ${path.basename(versionDir)}`)
      }
    }

    console.log('Formatted all generated files with Prettier')
    console.log(
      '✅ Protocol Buffer generation completed successfully for all versions!',
    )
  } catch (error) {
    console.error('❌ Failed to generate Protocol Buffer files:', error)
    process.exit(1)
  }
}

generateAllProtocolBuffers()
