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
  mainModuleIdUsedInExample = '',
  relativeReadmeFilePath = '',
  relativeExamplesDirPath = '',
] = parsedArgv._;

// TODO: Validate args

const readmeFilePath = path.join(cwd, relativeReadmeFilePath);
const examplesDirPath = path.join(cwd, relativeExamplesDirPath);

embedExamples.execute(moduleName, mainModuleIdUsedInExample, readmeFilePath, examplesDirPath)
  .then(results => {
    if (results.exitCode > 0) {
      process.stdout.write(`${results.outputErrorMessage}\n`);
    }
    process.exit(results.exitCode)
  });
