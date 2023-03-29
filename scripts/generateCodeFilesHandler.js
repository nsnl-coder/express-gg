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
  cwd = process.cwd();

  constructor(singular, plural) {
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
    ] = this.#getNewCodeFilesContent();

    // 2. write code files

    const controllerFilePath = path.join(
      this.cwd,
      'src',
      'controllers',
      getControllerFileName(this.singular),
    );

    const modelFilePath = path.join(
      this.cwd,
      'src',
      'models',
      getModelFileName(this.singular),
    );

    const routerFilePath = path.join(
      this.cwd,
      'src',
      'routes',
      getRouterFileName(this.singular),
    );

    const schemaFilePath = path.join(
      this.cwd,
      'src',
      'yup',
      getSchemaFileName(this.singular),
    );

    console.clear();
    console.log(chalk.blue('Generating code files....'));

    // controller
    fs.mkdirSync('./src/controllers', { recursive: true });
    fs.writeFileSync(controllerFilePath, controllerFileContent);
    console.log(
      chalk.green(`${getControllerFileName(this.singular)} created!`),
    );

    // models
    fs.mkdirSync('./src/models', { recursive: true });
    fs.writeFileSync(modelFilePath, modelFileContent);
    console.log(chalk.green(`${getModelFileName(this.singular)} created!`));

    // routes:
    fs.mkdirSync('./src/routes', { recursive: true });
    fs.writeFileSync(routerFilePath, routerFileContent);
    console.log(chalk.green(`${getRouterFileName(this.singular)} created!`));

    // schema file
    fs.mkdirSync('./src/yup', { recursive: true });
    fs.writeFileSync(schemaFilePath, schemaFileContent);
    console.log(chalk.green(`${getSchemaFileName(this.singular)} created!`));
  };

  #getNewCodeFilesContent = () => {
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
