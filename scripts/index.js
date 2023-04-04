#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const chalk = require('chalk');
//
const TestFilesHandler = require('./TestFilesHandler');
const CodeFilesHandler = require('./CodeFilesHandler');
const {
  isAtRootFolder,
  checkDependencies,
  isWorkingDirectoryClean,
} = require('./utils');
const {
  getAndValidateUserInput,
  isIncludeTestFiles,
  getDeleteFilesOptions,
} = require('./cli');
const initializeProject = require('./init');
const { generatePostManFile, deletePostManFile } = require('./postman');

//
if (argv.v || argv.version) {
  const { onePackageJsonContent } = readPackageJson();
  console.log(`express version ${onePackageJsonContent.version}`);
  return;
}

// 0. initalize project
if (argv._.includes('init')) {
  initializeProject();
  return;
}

if (
  !argv.d &&
  !argv.delete &&
  !argv._.includes('delete') &&
  !isWorkingDirectoryClean()
)
  return;

// 1. Check if user is at root folder
if (!isAtRootFolder()) return;

// 2. collect resource info
const resourceName = getAndValidateUserInput();
if (!resourceName) return;
const { singular, plural } = resourceName;

const codeFilesHandler = new CodeFilesHandler(singular, plural);
const testFilesHandler = new TestFilesHandler(singular, plural);

// 4. handle delete files case

if (argv.delete || argv.d || argv._.includes('delete')) {
  const { deleteCodeFiles, deleteTestFiles } = getDeleteFilesOptions();

  if (deleteCodeFiles) {
    codeFilesHandler.deleteCodeFiles();
    deletePostManFile(singular);
  }

  if (deleteTestFiles) {
    testFilesHandler.deleteTestFiles();
  }

  return;
}

// 5. handle generate file cases
const includeTestFiles = isIncludeTestFiles();
codeFilesHandler.generateCodeFiles();

// generate postman file
generatePostManFile(singular, plural);

if (includeTestFiles) {
  testFilesHandler.generateTestFiles();
}

// 6. if dev,dependencies missing
let isMissingDevDependencies =
  includeTestFiles && testFilesHandler.setupTests();

let isMissingDependencies = checkDependencies(
  'yup-schemas',
  'yup',
  'mongoose',
  'express',
  'express-common-middlewares',
);

if (isMissingDependencies || isMissingDevDependencies) {
  console.log(
    chalk.green('\n--> To install missing pakages:'),
    chalk.blue('npm install'),
  );
}

if (includeTestFiles) {
  console.log(chalk.green('\n--> To run tests:'), chalk.blue('npm test'));
}

console.log(
  chalk.green('--> To start project:'),
  chalk.blue('npm start'),
  '\n',
);
