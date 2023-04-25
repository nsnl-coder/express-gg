import chalk from 'chalk';
import fs from 'fs';
import { getNewFileContent, files, insertCode } from './utils';

class CodeFilesHandler {
  cwd = process.cwd();

  files: any;

  constructor(public singular: string, public plural: string) {
    this.files = files(singular);
  }

  deleteCodeFiles = () => {
    // current paths
    const currentPaths = [
      this.files.newControllerPath,
      this.files.newModelPath,
      this.files.newRouterPath,
      this.files.newSchemaPath,
    ];

    // one paths
    const onePaths = [
      this.files.oneControllerPath,
      this.files.oneModelPath,
      this.files.oneRouterPath,
      this.files.oneSchemaPath,
    ];

    console.log(chalk.blue('Deleting code files...'));

    currentPaths.forEach((path, index) => {
      if (!fs.existsSync(path)) return;

      const newContent = getNewFileContent(
        onePaths[index],
        this.singular,
        this.plural,
      );
      const currentContent = fs.readFileSync(path, { encoding: 'utf-8' });

      if (newContent === currentContent) {
        fs.rmSync(path);
        console.log(chalk.green(`${path} deleted`));
        return;
      }

      console.log(
        chalk.red(`Can not delete ${path} because it has been edited`),
      );
    });
  };

  generateCodeFiles = () => {
    // 0. check if code file already exist
    if (this.#codeFilesAlreadyExist()) return;

    // 1. get data
    const [
      controllerFileContent,
      modelFileContent,
      routerFileContent,
      schemaFileContent,
    ] = this.#getNewCodeFilesContent();

    if (
      !controllerFileContent ||
      !modelFileContent ||
      !routerFileContent ||
      !schemaFileContent
    ) {
      console.error('Can not read code file content');
      return;
    }

    // 2. write code files
    console.log(chalk.blue('Generating code files....'));

    // controller
    fs.mkdirSync('./src/controllers', { recursive: true });
    fs.writeFileSync(this.files.newControllerPath, controllerFileContent);
    console.log(chalk.green(`${this.files.controllerFileName} created!`));

    // models
    fs.mkdirSync('./src/models', { recursive: true });
    fs.writeFileSync(this.files.newModelPath, modelFileContent);
    console.log(chalk.green(`${this.files.modelFileName} created!`));

    // routers:
    fs.mkdirSync('./src/routers', { recursive: true });
    fs.writeFileSync(this.files.newRouterPath, routerFileContent);
    console.log(chalk.green(`${this.files.routerFilename} created!`));

    // schema file
    fs.mkdirSync('./src/yup', { recursive: true });
    fs.writeFileSync(this.files.newSchemaPath, schemaFileContent);
    console.log(chalk.green(`${this.files.schemaFileName} created!`));

    // apply router to express app
    insertCode(
      './src/routers/index.ts',
      '#insert__routers',
      `\nimport ${this.singular}Router from './${this.singular}Router';`,
    );

    insertCode(
      './src/routers/index.ts',
      '#use__routers',
      `\nrouter.use('/api/${this.plural}',${this.singular}Router);`,
    );
  };

  #getNewCodeFilesContent = () => {
    const oneFilesPaths = [
      this.files.oneControllerPath,
      this.files.oneModelPath,
      this.files.oneRouterPath,
      this.files.oneSchemaPath,
    ];

    return oneFilesPaths.map((filepath) =>
      getNewFileContent(filepath, this.singular, this.plural),
    );
  };

  #codeFilesAlreadyExist = () => {
    // prettier-ignore
    let isExisted =
      this.#codeFileExist(this.files.newControllerPath, this.files.controllerFileName) ||
      this.#codeFileExist(this.files.newModelPath, this.files.modelFileName) ||
      this.#codeFileExist(this.files.newRouterPath, this.files.routerFilename) ||
      this.#codeFileExist(this.files.newSchemaPath, this.files.schemaFileName);

    if (isExisted) return true;
    return false;
  };

  #codeFileExist = (filepath: string, filename: string) => {
    if (fs.existsSync(filepath)) {
      console.log(
        chalk.red(
          `${filepath} already exists! You can delete ${filename} and try again!`,
        ),
      );
      return true;
    }

    return false;
  };
}

export default CodeFilesHandler;
