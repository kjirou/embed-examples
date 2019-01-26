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

function exitWithErrorMessage(message) {
  const ansiEscapeColorRed = '\x1b[31m';
  const ansiEscapeColorReset = '\x1b[0m';
  process.stderr.write(`${ansiEscapeColorRed}${message}${ansiEscapeColorReset}\n`);
  process.exit(1);
}

const cwd = process.cwd();

const parsedArgv = minimist(process.argv.slice(2), {
  boolean: [
    'overwrite',
  ],
  string: [
    'examples-dir',
    'newline-character',
    'replacement',
  ],
  default: {
    'examples-dir': '',
    'newline-character': 'LF',
    overwrite: false,
    replacement: '',
  },
  alias: {
    e: 'examples-dir',
    n: 'newline-character',
    o: 'overwrite',
    r: 'replacement',
  },
});
const [
  relativeReadmeFilePath = '',
] = parsedArgv._;

if (!relativeReadmeFilePath) {
  exitWithErrorMessage('The path of "README.md" is necessary.');
}

const readmeFilePath = path.join(cwd, relativeReadmeFilePath);
const readmeText = fs.readFileSync(readmeFilePath).toString();

const examplesDirPath = parsedArgv['examples-dir'] || path.dirname(readmeFilePath);

const replacementQueries = parsedArgv.replacement instanceof Array
  ? parsedArgv.replacement
  : parsedArgv.replacement !== ''
    ? [parsedArgv.replacement]
    : [];
const replacementKeywords = replacementQueries.map(replacementQuery => {
  const [from, to] = replacementQuery.split(',');
  if (!from || typeof to !== 'string') {
    exitWithErrorMessage('The "--replacement" option requires a value like "--replacement from,to".');
  }
  return {
    from,
    to,
  };
});

const newlineCharacter = parsedArgv['newline-character'];
if (['LF', 'CR', 'CRLF'].indexOf(newlineCharacter) === -1) {
  exitWithErrorMessage('The "--newline-character" option requires one of ["LF", "CR", "CRLF"].');
}

const output = embedExamples.execute(readmeText, examplesDirPath, replacementKeywords, newlineCharacter);

if (parsedArgv.overwrite) {
  fs.writeFileSync(readmeFilePath, output);
}

process.stdout.write(output);
process.exit();
