#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// 1. Check if user is at root folder
const { isAtRootFolder } = require('./utils');
const { getAndValidateUserInput, isIncludeTestFiles } = require('./cli');
const GenerateCodeFilesHandler = require('./generateCodeFilesHandler');
const GenerateTestFilesHandler = require('./generateTestFilesHandler');
if (!isAtRootFolder()) return;

// 2. handle base on different input

// handle delete files case
if (argv.delete || argv.d || argv._.includes('delete')) {
  console.log('handle delete');
  return;
}

// get user inputs
const resourceName = getAndValidateUserInput();
if (!resourceName) return;

const { singular, plural } = resourceName;
const includeTestFiles = isIncludeTestFiles();

// generate code files: controller, model, routes, yup schema
const generateCodeFiles = new GenerateCodeFilesHandler(singular, plural);
generateCodeFiles.writeCodeFiles();

// generate test files
if (includeTestFiles) {
  const generateTestFiles = new GenerateTestFilesHandler(singular, plural);
  generateTestFiles.writeTestFiles();
}
