const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });
const { getNewFileName } = require('./utils');

class GenerateTestFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
  }

  writeTestFiles() {
    const testDir = path.join(__dirname, '..', 'src', 'test', 'ones');

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
        const content = convertFileContent(
          filepath,
          this.singular,
          this.plural,
        );
        const newFileName = getNewFileName(file, this.singular, this.plural);
        const newFilePath = path.join('src', 'test', this.plural, newFileName);

        fs.writeFileSync(newFilePath, content);

        console.log(chalk.green(`${newFileName} created!`));
      });
    });
  }
}

module.exports = GenerateTestFilesHandler;
