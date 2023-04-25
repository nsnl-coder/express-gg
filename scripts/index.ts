#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import fs from 'fs';
import TestFilesHandler from './TestFilesHandler';
import CodeFilesHandler from './CodeFilesHandler';

import {
  isAtRootFolder,
  checkDependencies,
  isWorkingDirectoryClean,
  files,
} from './utils';

import {
  getAndValidateUserInput,
  isIncludeTestFiles,
  getDeleteFilesOptions,
} from './cli';

import initializeProject from './init';
import { generatePostManFile, deletePostManFile } from './postman';

interface Argv {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
}

function main() {
  const argv: Argv | Promise<Argv> = yargs(hideBin(process.argv)).argv;

  if (argv instanceof Promise) return;

  if (argv.v || argv.version) {
    const onePackageJsonContent = fs.readFileSync(files().onePackageJsonPath);
    console.log(
      `gg version ${JSON.parse(JSON.stringify(onePackageJsonContent)).version}`,
    );
  }

  // 0. initalize project
  if (argv._.includes('init')) {
    initializeProject();
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
}

main();
