import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { checkDependencies, checkDevDependencies } from './utils';

const initializeProject = () => {
  if (!fs.existsSync('./package.json')) {
    fs.writeFileSync('./package.json', JSON.stringify({}));
  }
  // create folder structure
  console.log(chalk.blue('Generating folder structure.....'));
  [
    'src',
    'src/config',
    'src/middlewares',
    'src/routes',
    'src/models',
    'src/controllers',
    'src/utils',
    'src/postman',
  ].forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      console.log(chalk.green(`${path} folder created`));
    }
  });

  console.log(chalk.blue('\nGenerating files.....'));

  // create necessary file
  [
    'src/config/db.js',
    'src/index.js',
    'src/routes/index.js',
    'src/models/userModel.js',
    './.env',
  ].forEach((pathname) => {
    const onePath = path.join(__dirname, '..', pathname);
    const newPath = pathname;

    const oneContent = fs.readFileSync(onePath, { encoding: 'utf-8' });

    if (!fs.existsSync(newPath)) {
      fs.writeFileSync(newPath, oneContent);
      console.log(chalk.green(`${pathname} created`));
    } else {
      console.log(chalk.red(`${pathname} existed`));
    }
  });
  // create .gitignore
  fs.writeFileSync('./.gitignore', 'node_modules\n.env');

  // handle app.js
  const appContent = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'config', 'app2.js'),
    {
      encoding: 'utf-8',
    },
  );

  if (!fs.existsSync('./src/config/app.js')) {
    fs.writeFileSync('./src/config/app.js', appContent);
  }

  // check for miss depen
  const isMissingDependencies = checkDependencies(
    'dotenv',
    'mongoose',
    'express',
  );
  const isMissingDevDependencies = checkDevDependencies('nodemon');

  if (isMissingDependencies || isMissingDevDependencies) {
    console.log(
      chalk.green('--> To install missing packages:'),
      chalk.blue('npm install'),
    );
    console.log(
      chalk.green('--> Start your project:'),
      chalk.blue('npm start'),
      '\n',
    );
  }
};

export default initializeProject;