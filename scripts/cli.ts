import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Prompt from 'prompt-sync';

const prompt = Prompt({ sigint: true });
const cwd = process.cwd();

const getDeleteFilesOptions = () => {
  const deleteCodeFiles = prompt('Delete code files (y/n)? ');
  const deleteTestFiles = prompt('Delete test files (y/n)? ');

  return {
    deleteCodeFiles: deleteCodeFiles === 'y' || deleteCodeFiles === 'yes',
    deleteTestFiles: deleteTestFiles === 'y' || deleteTestFiles === 'yes',
  };
};

const getAndValidateUserInput = () => {
  if (!process.env.CONNECTION_STRING) {
    return console.log(
      chalk.red(
        'You need to add CONNECTION_STRING to your .env file to continue.',
      ),
    );
  }

  let singular: string | false = prompt('Singular form of your resource? ');
  singular = isValidResourceName(singular);

  if (!singular) return null;

  let plural: string | false = prompt('Plural form of your resource? ');
  plural = isValidResourceName(plural);

  if (!plural) return null;

  if (!plural.includes(singular)) {
    const isContinue = prompt(
      chalk.yellow(
        'Your inputed plural form does not seem to be right, do you want to continue (y/n)?  ',
      ),
    );

    if (isContinue !== 'y' && isContinue !== 'yes') {
      console.log(chalk.red('existed'));
      return;
    }
  }

  return { singular, plural };
};

const isValidResourceName = (name: string) => {
  name = name.trim().toLowerCase();

  if (!/^[a-z]+$/.test(name)) {
    console.log(
      chalk.red('Your resource name should not contain number or space!'),
    );
    return false;
  }

  return name;
};

const isIncludeTestFiles = () => {
  const confirm = prompt('Include test files (y / n)? ');

  if (confirm === 'y' || confirm == 'yes') return true;
  return false;
};

const testFilesAlreadyExist = (plural: string) => {
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

export {
  isValidResourceName,
  getAndValidateUserInput,
  isIncludeTestFiles,
  testFilesAlreadyExist,
  getDeleteFilesOptions,
};
