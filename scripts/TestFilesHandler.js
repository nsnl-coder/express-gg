const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { getNewFileName, getNewFileContent } = require('./utils');

class TestFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
  }

  deleteTestFiles() {
    if (fs.existsSync(`./src/test/${this.plural}`)) return;
  }

  generateTestFiles() {
    const newTestDir = `./src/test/${this.plural}`;

    if (fs.existsSync(newTestDir)) {
      console.log(chalk.red(`${newTestDir} already exists!`));
      return;
    }

    fs.mkdirSync(`./src/test/${this.plural}`, { recursive: true });
    console.log(chalk.blue('\nGenerating test files....'));

    const testDir = path.join(__dirname, '..', 'src', 'test', 'ones');
    fs.readdir(testDir, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach((file) => {
        const testFilePath = path.join(
          __dirname,
          '..',
          'src',
          'test',
          'ones',
          file,
        );

        const newTestFileName = getNewFileName(
          file,
          this.singular,
          this.plural,
        );
        const newTestFilePath = path.join(
          'src',
          'test',
          this.plural,
          newTestFileName,
        );
        const newTestContent = getNewFileContent(
          testFilePath,
          this.singular,
          this.plural,
        );

        fs.writeFileSync(newTestFilePath, newTestContent);

        console.log(chalk.green(`${newTestFileName} created!`));
      });
    });
  }
}

module.exports = TestFilesHandler;
