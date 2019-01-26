#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let embedExamples;

if (fs.existsSync(path.join(__dirname, '../dist/index.js'))) {
  embedExamples = require('../dist');
} else {
  require('../setup/ts-node-reigister-for-cli-debug');
  embedExamples = require('../src');
}

console.log(embedExamples.dummy());
