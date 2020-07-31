#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const { exec } = require('child_process')

const pbjs = require('protobufjs/cli/pbjs')
const pbts = require('protobufjs/cli/pbts')
const outputDir = path.join(process.cwd(), 'src/proto/')

pbjs.main(
  [
    '--target',
    'static-module',
    'src/proto/project.proto',
    '-w',
    'es6',
    '--es6',
  ],
  function (err, output) {
    if (err) throw err

    const js = path.join(outputDir, 'project.js')
    const dts = path.join(outputDir, 'project.d.ts')
    fs.writeFile(
      js,
      '/* eslint-disable */' + output.replace(/\/\*[\s\S\w\W].*?\*\//, ''),
      () => {
        pbts.main([js], (err, outputDts) => {
          if (err) throw err
          fs.writeFile(dts, '/* eslint-disable */\n' + outputDts, (err) => {
            if (err) throw err
            exec(
              `${path.join(
                process.cwd(),
                'node_modules/.bin/prettier',
              )} --write ${outputDir}*.{ts,js}`,
            )
          })
        })
      },
    )
  },
)
