#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// 1. Check if user is at root folder
const { isAtRootFolder } = require('./utils');
const { getAndValidateUserInput, isIncludeTestFiles } = require('./cli');
const CodeFilesHandler = require('./CodeFilesHandler');
const TestFilesHandler = require('./TestFilesHandler');
if (!isAtRootFolder()) return;

// 2. collect resource info
const resourceName = getAndValidateUserInput();
if (!resourceName) return;
const { singular, plural } = resourceName;

const codeFilesHandler = new CodeFilesHandler(singular, plural);
const testFilesHandler = new TestFilesHandler(singular, plural);

// 4. handle delete files case

if (argv.delete || argv.d || argv._.includes('delete')) {
  codeFilesHandler.deleteCodeFiles();
  return;
}

// 5. handle generate file cases
const includeTestFiles = isIncludeTestFiles();
codeFilesHandler.generateCodeFiles();

if (includeTestFiles) {
  testFilesHandler.generateTestFiles();
}
