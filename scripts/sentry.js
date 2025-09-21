#!/usr/bin/env node
import SentryCli from '@sentry/cli'
import path from 'path'
import fs from 'fs'
import getGitRelease from './getGitRelease.js'


async function createReleaseAndUpload() {
  try {
    const release = await getGitRelease()
    if (!release) {
      console.warn('No release version available, skipping Sentry upload')
      return
    }

    console.log(`Creating Sentry release: ${release}`)
    const cli = new SentryCli()

    // Check if build directory exists
    const buildDir = path.join(process.cwd(), 'build')
    const jsDir = path.join(buildDir, 'assets')

    if (!fs.existsSync(buildDir)) {
      console.warn('Build directory does not exist, skipping Sentry upload')
      return
    }

    if (!fs.existsSync(jsDir)) {
      console.warn('Assets directory does not exist, skipping Sentry upload')
      return
    }

    try {
      // Create release version
      console.log(`Creating Sentry release: ${release}`)
      await cli.releases.new(release)

      // Upload source maps (Vite build assets are in assets directory)
      console.log('Uploading source maps...')
      await cli.releases.uploadSourceMaps(release, {
        include: ['build/assets'],
        urlPrefix: '~/assets/',
        rewrite: false,
        stripCommonPrefix: true,
      })

      // Finalize release
      console.log('Finalizing release...')
      await cli.releases.finalize(release)

      console.log(
        `Sentry release ${release} created and finalized successfully!`,
      )
    } catch (releaseError) {
      console.error('Sentry release operation failed:', releaseError.message)

      // Attempt to clean up potentially incomplete release
      try {
        await cli.releases.delete(release)
        console.log('Cleaned up incomplete release')
      } catch (cleanupError) {
        console.warn(
          'Failed to cleanup incomplete release:',
          cleanupError.message,
        )
      }

      throw releaseError
    }
  } catch (error) {
    console.error('Sentry upload failed:', error.message)

    // Don't interrupt the entire deployment process due to Sentry upload failure
    console.warn('Continuing deployment despite Sentry upload failure...')
    process.exit(0)
  }
}

createReleaseAndUpload()
