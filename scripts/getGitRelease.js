import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Get the current git commit short hash
 * @returns {Promise<string>} The short commit hash
 */
async function getGitRelease() {
  try {
    const { stdout, stderr } = await execAsync('git rev-parse --short HEAD')

    if (stderr) {
      console.warn('Git warning:', stderr)
    }

    const release = stdout.trim()
    if (!release) {
      throw new Error('Failed to get git commit hash')
    }

    return release
  } catch (error) {
    console.error('Failed to get git release:', error.message)

    // If retrieval fails, return a default value or current timestamp
    const fallback = `dev-${Date.now()}`
    console.warn(`Using fallback release: ${fallback}`)
    return fallback
  }
}

export default getGitRelease
