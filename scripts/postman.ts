import chalk from 'chalk';
import fs from 'fs';
import { files, getNewFileContent } from './utils';

const generatePostManFile = (singular: string, plural: string) => {
  const filespath = files(singular);
  const newPostManContent = getNewFileContent(
    filespath.onePostManPath,
    singular,
    plural,
  );

  if (!newPostManContent) return;
  fs.mkdirSync('./src/postman', { recursive: true });

  if (!fs.existsSync(filespath.newPostManPath)) {
    fs.writeFileSync(filespath.newPostManPath, newPostManContent);
    console.log(chalk.green(`${filespath.newPostManPath} created`));
  } else {
    console.log(chalk.red(`${filespath.newPostManPath} existed!`));
  }
};

const deletePostManFile = (singular: string) => {
  const filespath = files(singular);
  if (fs.existsSync(filespath.newPostManPath)) {
    fs.rmSync(filespath.newPostManPath);
    console.log(chalk.green(`${filespath.newPostManPath} deleted`));
  }
};

export { generatePostManFile, deletePostManFile };
