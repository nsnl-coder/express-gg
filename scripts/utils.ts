import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const cwd = process.cwd();

const files = (singular?: string) => {
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
    newRouterPath: `./src/routes/${singular}Routes.js`,
    newSchemaPath: `./src/yup/${singular}Schema.js`,
    //
    oneSetupTestPath: path.join(__dirname, '..', 'src', 'test', 'setup.js'),
    newSetupTestPath: './src/test/setup.js',
    onePackageJsonPath: path.join(__dirname, '..', 'package.json'),
    newPackageJsonPath: './package.json',
    //
    onePostManPath: path.join(__dirname, '..', 'src', 'postman', 'one.json'),
    newPostManPath: `./src/postman/${singular}.json`,
  };
};

const readPackageJson = () => {
  const filespath = files();

  const newPackageJsonBuffer = fs.readFileSync(filespath.newPackageJsonPath, {
    encoding: 'utf-8',
  });
  let newPackageJsonContent = JSON.parse(newPackageJsonBuffer);

  const onePackageJsonBuffer = fs.readFileSync(filespath.onePackageJsonPath, {
    encoding: 'utf-8',
  });
  const onePackageJsonContent = JSON.parse(onePackageJsonBuffer);

  // prepare package.json
  if (!newPackageJsonContent.dependencies) {
    newPackageJsonContent.dependencies = {};
  }

  if (!newPackageJsonContent.scripts) {
    newPackageJsonContent.scripts = {};
  }

  if (!newPackageJsonContent.devDependencies) {
    newPackageJsonContent.devDependencies = {};
  }

  return {
    newPackageJsonContent,
    onePackageJsonContent,
  };
};

const checkDevDependencies = (...devDependencies: string[]) => {
  // read package.json
  const { newPackageJsonContent, onePackageJsonContent } = readPackageJson();

  const newPackageJsonContentCopy = JSON.parse(
    JSON.stringify(newPackageJsonContent),
  );

  const newDevDependenciesKeys = Object.keys(
    newPackageJsonContent.devDependencies,
  );

  const isMissingDevDependencies = !devDependencies.every((item) =>
    newDevDependenciesKeys.includes(item),
  );

  if (isMissingDevDependencies) {
    const missingDevDependencies = devDependencies.filter(
      (item) => !newDevDependenciesKeys.includes(item),
    );

    missingDevDependencies.forEach((key) => {
      newPackageJsonContent.devDependencies[key] =
        onePackageJsonContent.devDependencies[key];
    });

    console.log(
      chalk.blue('Added missing devDependencies to package.json: '),
      chalk.green(missingDevDependencies.join(', ')),
    );
  }

  const filespath = files();
  if (newPackageJsonContent !== newPackageJsonContentCopy) {
    fs.writeFileSync(
      filespath.newPackageJsonPath,
      JSON.stringify(newPackageJsonContent),
    );
  }

  if (isMissingDevDependencies) return true;
};

const checkDependencies = (...dependencies: string[]) => {
  // check for package.json
  const { newPackageJsonContent, onePackageJsonContent } = readPackageJson();

  const newPackageJsonContentCopy = JSON.parse(
    JSON.stringify(newPackageJsonContent),
  );

  // check for script
  if (!newPackageJsonContent.scripts.start) {
    newPackageJsonContent.scripts.start = 'nodemon src/index.js';
  }

  const newDependenciesKeys = Object.keys(newPackageJsonContent.dependencies);

  const oneDependencies: {
    [key: string]: string;
  } = {};

  dependencies.forEach((packageName: string) => {
    oneDependencies[packageName] =
      onePackageJsonContent.dependencies[packageName];
  });

  const oneDependenciesKeys = Object.keys(oneDependencies);

  const isMissingDependencies = !oneDependenciesKeys.every((item) =>
    newDependenciesKeys.includes(item),
  );

  if (isMissingDependencies) {
    const missingDependencies = oneDependenciesKeys.filter(
      (item) => !newDependenciesKeys.includes(item),
    );

    missingDependencies.forEach((key) => {
      newPackageJsonContent.dependencies[key] = oneDependencies[key];
    });

    console.log(
      chalk.blue(`Added missing dependencies to package.json:`),
      chalk.green(missingDependencies.join(', ')),
    );
  }

  const filespath = files();

  if (newPackageJsonContent !== newPackageJsonContentCopy) {
    fs.writeFileSync(
      filespath.newPackageJsonPath,
      JSON.stringify(newPackageJsonContent),
    );
  }

  return isMissingDependencies;
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

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getNewFileContent = (path: string, singular: string, plural: string) => {
  if (!fs.existsSync(path)) {
    return null;
  }

  let filecontent = fs.readFileSync(path, { encoding: 'utf-8' });

  filecontent = filecontent.replace(/ones/g, plural);
  filecontent = filecontent.replace(/Ones/g, capitalizeFirstLetter(plural));
  filecontent = filecontent.replace(/one/g, singular);
  filecontent = filecontent.replace(/One/g, capitalizeFirstLetter(singular));
  return filecontent;
};

const getNewFileName = (name: string, singular: string, plural: string) => {
  if (name.includes('ones')) return name.replace('ones', plural);
  if (name.includes('one')) return name.replace('one', singular);

  return name;
};

const insertCode = (filepath: string, insertPoint: string, code: string) => {
  const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
  const newData = data.replace(insertPoint, `${insertPoint}${code}`);

  console.log(chalk.yellow(`${filepath} modified`));
  fs.writeFileSync(filepath, newData);
};

import { spawnSync } from 'child_process';

const isWorkingDirectoryClean = () => {
  if (!fs.existsSync('.git')) return true;

  const result = spawnSync('git', ['status', '--porcelain']);
  const output = result.stdout.toString().trim();

  if (output) {
    console.log(
      chalk.red(
        'Working directory is not clean! Commit all of your changes and try again!',
      ),
    );
    return false;
  }

  return true;
};

export {
  files,
  isAtRootFolder,
  capitalizeFirstLetter,
  getNewFileContent,
  getNewFileName,
  checkDependencies,
  checkDevDependencies,
  readPackageJson,
  insertCode,
  isWorkingDirectoryClean,
};