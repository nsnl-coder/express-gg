const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

const {
  getControllerFileName,
  getModelFileName,
  getRouterFileName,
  getSchemaFileName,
} = require('./utils');

const cwd = process.cwd();

const getAndValidateUserInput = () => {
  let singular = prompt('Singular form of your resource? ');
  singular = isValidResourceName(singular);

  if (!singular) return null;

  let plural = prompt('Plural form of your resource? ');
  plural = isValidResourceName(plural);

  if (!plural) return null;

  if (!plural.includes(singular)) {
    const isContinue = prompt(
      chalk.yellow(
        'Your inputed plural form does not seem to be right, do you want to continue (y/n)?  ',
      ),
    );

    if (isContinue !== 'y' || isContinue !== 'yes') {
      console.log(chalk.red('existed'));
      return;
    }
  }

  // check if code files already exist
  const codeFilesExist = codeFilesAlreadyExist(singular);

  if (codeFilesExist) return null;

  return { singular, plural };
};

const isValidResourceName = (name) => {
  name = name.trim().toLowerCase();

  if (!/^[a-z]+$/.test(name)) {
    console.log(
      chalk.red('Your resource name should not contain number or space!'),
    );
    return false;
  }

  return name;
};

const codeFileExist = (filepath, filename) => {
  let shortenPath = filepath.replace(cwd, '');

  if (fs.existsSync(filepath)) {
    console.log(
      chalk.red(
        `${shortenPath} already exists! You can delete ${filename} and try again!`,
      ),
    );
    return true;
  }

  return false;
};

const codeFilesAlreadyExist = (singular) => {
  const controllerFileName = getControllerFileName(singular);
  const modelFileName = getModelFileName(singular);
  const routerFilename = getRouterFileName(singular);
  const yupFilename = getSchemaFileName(singular);

  //
  const modelPath = path.join(cwd, 'src', 'models', `${modelFileName}`);
  const routerPath = path.join(cwd, 'src', 'yup', `${routerFilename}`);
  const yupPath = path.join(cwd, 'src', 'yup', `${yupFilename}`);
  const controllerPath = path.join(
    cwd,
    'src',
    'controllers',
    controllerFileName,
  );

  let isExisted =
    codeFileExist(controllerPath, controllerFileName) ||
    codeFileExist(modelPath, modelFileName) ||
    codeFileExist(routerPath, routerFilename) ||
    codeFileExist(yupPath, yupFilename);

  if (isExisted) return true;

  return false;
};

const isIncludeTestFiles = () => {
  const confirm = prompt('Do you want to include test files (y / n)? ');

  if (confirm === 'y' || confirm == 'yes') return true;
  return false;
};

const testFilesAlreadyExist = (plural) => {
  const testFolderPath = path.join(cwd, 'src', 'test', plural);

  if (fs.existsSync(testFolderPath)) {
    console.log(
      chalk.red(
        `/src/test/${plural} folder already exist! Delete ${plural} folder and try again!`,
      ),
    );
    return true;
  }

  return false;
};

module.exports = {
  isValidResourceName,
  getAndValidateUserInput,
  codeFilesAlreadyExist,
  isIncludeTestFiles,
  testFilesAlreadyExist,
};
