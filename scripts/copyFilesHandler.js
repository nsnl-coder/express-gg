const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

//
const {
  getControllerFileName,
  getModelFileName,
  getRouterFileName,
  getSchemaFileName,
} = require('./utils');

const cwd = process.cwd();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertFileContent(path, singular, plural) {
  let filecontent = fs.readFileSync(path, { encoding: 'utf-8' });

  filecontent = filecontent.replaceAll('ones', singular);
  filecontent = filecontent.replaceAll('Ones', capitalizeFirstLetter(plural));
  filecontent = filecontent.replaceAll('one', singular);
  filecontent = filecontent.replaceAll('One', capitalizeFirstLetter(singular));
  return filecontent;
}

const readCodeFilesAndReplace = (singular, plural) => {
  const oneControllerPath = path.join(
    __dirname,
    '..',
    'src',
    'controllers',
    'oneController.js',
  );

  const oneModelPath = path.join(
    __dirname,
    '..',
    'src',
    'models',
    'oneModel.js',
  );

  const oneRoutesPath = path.join(
    __dirname,
    '..',
    'src',
    'routes',
    'oneRoutes.js',
  );

  const oneSchemaPath = path.join(
    __dirname,
    '..',
    'src',
    'yup',
    'oneSchema.js',
  );

  return [
    convertFileContent(oneControllerPath, singular, plural),
    convertFileContent(oneModelPath, singular, plural),
    convertFileContent(oneRoutesPath, singular, plural),
    convertFileContent(oneSchemaPath, singular, plural),
  ];
};

const writeCodeFiles = (data, singular, plural) => {
  // 1. get data
  const [
    controllerFileContent,
    modelFileContent,
    routerFileContent,
    schemaFileContent,
  ] = data;

  // 2. write code files

  const controllerFilePath = path.join(
    cwd,
    'src',
    'controllers',
    getControllerFileName(singular),
  );

  const modelFilePath = path.join(
    cwd,
    'src',
    'models',
    getModelFileName(singular),
  );

  const routerFilePath = path.join(
    cwd,
    'src',
    'routes',
    getRouterFileName(singular),
  );

  const schemaFilePath = path.join(
    cwd,
    'src',
    'yup',
    getSchemaFileName(singular),
  );

  fs.mkdir('./src/controllers', { recursive: true }, () => {
    fs.writeFileSync(controllerFilePath, controllerFileContent);
    console.log(chalk.green(`${getControllerFileName(singular)} created!`));
  });

  fs.mkdir('./src/models', { recursive: true }, () => {
    fs.writeFileSync(modelFilePath, modelFileContent);
    console.log(chalk.green(`${getModelFileName(singular)} created!`));
  });

  fs.mkdir('./src/routes', { recursive: true }, () => {
    fs.writeFileSync(routerFilePath, routerFileContent);
    console.log(chalk.green(`${getRouterFileName(singular)} created!`));
  });

  fs.mkdir('./src/yup', { recursive: true }, () => {
    fs.writeFileSync(schemaFilePath, schemaFileContent);
    console.log(chalk.green(`${getSchemaFileName(singular)} created!`));
  });
};

function getNewFileName(name, singular, plural) {
  if (name.includes('ones')) return name.replace('ones', plural);
  if (name.includes('one')) return name.replace('one', singular);

  return name;
}

function writeTestFiles(singular, plural) {
  const testDir = path.join(__dirname, '..', 'src', 'test', 'ones');

  fs.readdir(testDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }

    files.forEach((file) => {
      const filepath = path.join(__dirname, '..', 'src', 'test', 'ones', file);
      const content = convertFileContent(filepath, singular, plural);
      const newFileName = getNewFileName(file, singular, plural);

      const newFilePath = path.join('src', 'test', plural, newFileName);
      fs.writeFileSync(newFilePath, content);

      console.log(chalk.green(`${newFileName} created!`));
    });
  });
}

module.exports = {
  readCodeFilesAndReplace,
  writeCodeFiles,
  writeTestFiles,
};
