const exec = require('child_process').exec

function getGitRelease() {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
      if (err != null || typeof stderr != 'string') {
        reject(err || stderr)
      }
      resolve(stdout.trim())
    })
  })
}

module.exports = getGitRelease
