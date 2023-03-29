const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });
const { getNewFileContent } = require('./utils');

const {
  getControllerFileName,
  getModelFileName,
  getRouterFileName,
  getSchemaFileName,
} = require('./utils');

class GenerateCodeFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
  }

  writeCodeFiles = () => {
    // 1. get data
    const [
      controllerFileContent,
      modelFileContent,
      routerFileContent,
      schemaFileContent,
    ] = this.getNewCodeFilesContent();

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

  getNewCodeFilesContent = () => {
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
      getNewFileContent(oneControllerPath, this.singular, this.plural),
      getNewFileContent(oneModelPath, this.singular, this.plural),
      getNewFileContent(oneRoutesPath, this.singular, this.plural),
      getNewFileContent(oneSchemaPath, this.singular, this.plural),
    ];
  };
}

module.exports = GenerateCodeFilesHandler;
