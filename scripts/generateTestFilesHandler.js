const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });
const { getNewFileName, getNewFileContent } = require('./utils');

class GenerateTestFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
  }

  writeTestFiles() {
    const testDir = path.join(__dirname, '..', 'src', 'test', 'ones');

    fs.mkdirSync(`./src/test/${this.plural}`, { recursive: true });
    console.log(chalk.blue('\nGenerating test files....'));

    fs.readdir(testDir, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach((file) => {
        const filepath = path.join(
          __dirname,
          '..',
          'src',
          'test',
          'ones',
          file,
        );

        const newFileName = getNewFileName(file, this.singular, this.plural);
        const newFilePath = path.join('src', 'test', this.plural, newFileName);
        const newContent = getNewFileContent(
          filepath,
          this.singular,
          this.plural,
        );

        fs.writeFileSync(newFilePath, newContent);

        console.log(chalk.green(`${newFileName} created!`));
      });
    });
  }
}

module.exports = GenerateTestFilesHandler;
