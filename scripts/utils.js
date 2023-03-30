const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const cwd = process.cwd();

//
const getControllerFileName = (singular) => `${singular}Controller.js`;
const getModelFileName = (singular) => `${singular}Model.js`;
const getRouterFileName = (singular) => `${singular}Routes.js`;
const getSchemaFileName = (singular) => `${singular}Schema.js`;

//
const getNewControllerPath = (singular) => {
  return `./src/controllers/${singular}Controller.js`;
};

const getNewModelPath = (singular) => `./src/models/${singular}Model.js`;
const getNewRouterPath = (singular) => `./src/routes/${singular}Routes.js`;
const getNewSchemaPath = (singular) => `./src/yup/${singular}Schema.js`;

//
const getOneControllerPath = () => {
  return path.join(__dirname, '..', 'src', 'controllers', 'oneController.js');
};
const getOneModelPath = () => {
  return path.join(__dirname, '..', 'src', 'models', 'oneModel.js');
};
const getOneRouterPath = () => {
  return path.join(__dirname, '..', 'src', 'routes', 'oneRoutes.js');
};
const getOneSchemaPath = () => {
  return path.join(__dirname, '..', 'src', 'yup', 'oneSchema.js');
};
//
const files = (singular) => {
  return {
    //
    controllerFileName: getControllerFileName(singular),
    modelFileName: getModelFileName(singular),
    routerFilename: getRouterFileName(singular),
    schemaFileName: getSchemaFileName(singular),
    //
    oneControllerPath: getOneControllerPath(),
    oneModelPath: getOneModelPath(),
    oneRoutesPath: getOneRouterPath(),
    oneSchemaPath: getOneSchemaPath(),
    //
    newControllerPath: getNewControllerPath(singular),
    newModelPath: getNewModelPath(singular),
    newRouterpath: getNewRouterPath(singular),
    newSchemaPath: getNewSchemaPath(singular),
  };
};

const isAtRootFolder = () => {
  const packageJsonPath = path.join(cwd, './package.json');
  const isRootFolder = fs.existsSync(packageJsonPath);

  if (!isRootFolder) {
    console.log(
      chalk.red(
        'You are not at root of project because can not find package.json file in current working directory.',
      ),
    );

    return false;
  }

  return true;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getNewFileContent = (path, singular, plural) => {
  if (!fs.existsSync(path)) {
    return null;
  }

  let filecontent = fs.readFileSync(path, { encoding: 'utf-8' });

  filecontent = filecontent.replaceAll('ones', plural);
  filecontent = filecontent.replaceAll('Ones', capitalizeFirstLetter(plural));
  filecontent = filecontent.replaceAll('one', singular);
  filecontent = filecontent.replaceAll('One', capitalizeFirstLetter(singular));
  return filecontent;
};

const getNewFileName = (name, singular, plural) => {
  if (name.includes('ones')) return name.replace('ones', plural);
  if (name.includes('one')) return name.replace('one', singular);

  return name;
};

module.exports = {
  files,
  isAtRootFolder,
  capitalizeFirstLetter,
  getNewFileContent,
  getNewFileName,
};
