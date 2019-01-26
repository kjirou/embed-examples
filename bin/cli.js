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

const parsedArgv = minimist(process.argv.slice(2), {
  default: {
    'examples-dir': null,
    overwrite: false,
  },
  alias: {
    e: 'examples-dir',
    o: 'overwrite',
  },
});
const [
  moduleName = '',
  mainModuleIdUsedInExample = '',
  relativeReadmeFilePath = '',
] = parsedArgv._;

// TODO: Validate args

const readmeFilePath = path.join(cwd, relativeReadmeFilePath);
const readmeText = fs.readFileSync(readmeFilePath).toString();

const examplesDirPath = parsedArgv['examples-dir'] && typeof parsedArgv['examples-dir'] === 'string'
  ? parsedArgv['examples-dir'] : path.dirname(readmeFilePath);

const output = embedExamples.execute(readmeText, moduleName, mainModuleIdUsedInExample, examplesDirPath);

if (parsedArgv.overwrite) {
  fs.writeFileSync(readmeFilePath, output);
}

process.stdout.write(output);
process.exit();
