#!/usr/bin/env node

const fs = require('fs');
const minimist = require('minimist');
const path = require('path');

let embedExamples;

if (fs.existsSync(path.join(__dirname, '../dist/index.js'))) {
  embedExamples = require('../dist');
} else {
  require('../setup/ts-node-reigister-for-cli-debug');
  embedExamples = require('../src');
}

const cwd = process.cwd();

const parsedArgv = minimist(process.argv.slice(2));
const [
  moduleName = '',
  relativeInputDirPath = '',
  relativeOutputFilePath = '',
] = parsedArgv._;

// TODO: Validate args

const inputDirPath = path.join(cwd, relativeInputDirPath);
const outputFilePath = path.join(cwd, relativeOutputFilePath);

embedExamples.execute(moduleName, inputDirPath, outputFilePath)
  .then(results => {
    if (results.exitCode > 0) {
      process.stdout.write(`${results.outputErrorMessage}\n`);
    }
    process.exit(results.exitCode)
  });
