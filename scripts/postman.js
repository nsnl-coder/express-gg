const chalk = require('chalk');
const fs = require('fs');
const { files, getNewFileContent } = require('./utils');

const generatePostManFile = (singular, plural) => {
  const filespath = files(singular);
  const newPostManContent = getNewFileContent(
    filespath.onePostManPath,
    singular,
    plural,
  );

  fs.mkdirSync('./src/postman', { recursive: true });
  if (!fs.existsSync(filespath.newPostManPath)) {
    fs.writeFileSync(filespath.newPostManPath, newPostManContent);
    console.log(chalk.green(`${filespath.newPostManPath} created`));
  } else {
    console.log(chalk.red(`${filespath.newPostManPath} existed!`));
  }
};

const deletePostManFile = (singular) => {
  const filespath = files(singular);
  if (fs.existsSync(filespath.newPostManPath)) {
    fs.rmSync(filespath.newPostManPath);
    console.log(chalk.green(`${filespath.newPostManPath} deleted`));
  }
};

module.exports = { generatePostManFile, deletePostManFile };
