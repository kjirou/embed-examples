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
    replacement: null,
  },
  alias: {
    e: 'examples-dir',
    o: 'overwrite',
    r: 'replacement',
  },
});
const [
  relativeReadmeFilePath = '',
] = parsedArgv._;

// TODO: Validate args

const readmeFilePath = path.join(cwd, relativeReadmeFilePath);
const readmeText = fs.readFileSync(readmeFilePath).toString();

const examplesDirPath = parsedArgv['examples-dir'] && typeof parsedArgv['examples-dir'] === 'string'
  ? parsedArgv['examples-dir'] : path.dirname(readmeFilePath);

const replacementQueries = parsedArgv.replacement instanceof Array
  ? parsedArgv.replacement
  : typeof parsedArgv.replacement === 'string'
    ? [parsedArgv.replacement]
    : [];
const replacementKeywords = replacementQueries.map(replacementQuery => {
  // TODO: Validate "from,to" format
  const [from, to] = replacementQuery.split(',');
  return {
    from,
    to,
  };
});

parsedArgv['examples-dir'] && typeof parsedArgv['examples-dir'] === 'string'
  ? parsedArgv['examples-dir'] : path.dirname(readmeFilePath);

const output = embedExamples.execute(readmeText, examplesDirPath, replacementKeywords);

if (parsedArgv.overwrite) {
  fs.writeFileSync(readmeFilePath, output);
}

process.stdout.write(output);
process.exit();
