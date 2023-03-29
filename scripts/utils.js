const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const cwd = process.cwd();

//
const getControllerFileName = (singular) => `${singular}Controller.js`;
const getModelFileName = (singular) => `${singular}Model.js`;
const getRouterFileName = (singular) => `${singular}Routes.js`;
const getSchemaFileName = (singular) => `${singular}Schema.js`;

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
  let filecontent = fs.readFileSync(path, { encoding: 'utf-8' });

  filecontent = filecontent.replaceAll('ones', singular);
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
  getControllerFileName,
  getModelFileName,
  getRouterFileName,
  getSchemaFileName,
  isAtRootFolder,
  capitalizeFirstLetter,
  getNewFileContent,
  getNewFileName,
};
