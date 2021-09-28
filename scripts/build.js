#!/usr/bin/env node
const path = require('path')
const corssEnv = require('cross-env')
const getGitRelease = require('./getGitRelease')

const bin = path.join(process.cwd(), 'node_modules', '.bin')
const reactScripts = path.join(bin, 'react-scripts')

async function setSentryRelease() {
  const release = await getGitRelease()
  corssEnv([`REACT_APP_SENTRY_RELEASE=${release}`, reactScripts, `build`])
}

setSentryRelease()
