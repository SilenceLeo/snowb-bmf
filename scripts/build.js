#!/usr/bin/env node
import { spawn } from 'child_process'
import getGitRelease from './getGitRelease.js'


async function buildWithSentryRelease() {
  try {
    const release = await getGitRelease()
    console.log(`Building with Sentry release: ${release}`)

    // Set environment variables and execute Vite build
    const env = {
      ...process.env,
      VITE_SENTRY_RELEASE: release,
      REACT_APP_SENTRY_RELEASE: release, // Maintain backward compatibility
    }

    // Execute TypeScript compilation check
    console.log('Running TypeScript compilation check...')
    const tscProcess = spawn('npx', ['tsc', '--noEmit'], {
      stdio: 'inherit',
      env,
      shell: true,
    })

    tscProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('TypeScript compilation failed')
        process.exit(1)
      }

      console.log('Running Vite build...')
      // Execute Vite build
      const buildProcess = spawn('npx', ['vite', 'build'], {
        stdio: 'inherit',
        env,
        shell: true,
      })

      buildProcess.on('close', (buildCode) => {
        if (buildCode !== 0) {
          console.error('Vite build failed')
          process.exit(1)
        }
        console.log('Build completed successfully')
      })
    })
  } catch (error) {
    console.error('Failed to get git release:', error)
    process.exit(1)
  }
}

buildWithSentryRelease()
