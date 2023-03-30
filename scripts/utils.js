const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const cwd = process.cwd();

const files = (singular) => {
  return {
    //
    controllerFileName: `${singular}Controller.js`,
    modelFileName: `${singular}Model.js`,
    routerFilename: `${singular}Routes.js`,
    schemaFileName: `${singular}Schema.js`,
    //
    oneControllerPath: path.join(
      __dirname,
      '..',
      'src',
      'controllers',
      'oneController.js',
    ),
    oneModelPath: path.join(__dirname, '..', 'src', 'models', 'oneModel.js'),
    oneRoutesPath: path.join(__dirname, '..', 'src', 'routes', 'oneRoutes.js'),
    oneSchemaPath: path.join(__dirname, '..', 'src', 'yup', 'oneSchema.js'),
    //
    newControllerPath: `./src/controllers/${singular}Controller.js`,
    newModelPath: `./src/models/${singular}Model.js`,
    newRouterpath: `./src/routes/${singular}Routes.js`,
    newSchemaPath: `./src/yup/${singular}Schema.js`,
    //
    oneSetupTestPath: path.join(__dirname, '..', 'src', 'test', 'setup.js'),
    newSetupTestPath: './src/test/setup2.js',
    onePackageJsonPath: path.join(__dirname, '..', 'package.json'),
    newPackageJsonPath: './package2.json',
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
