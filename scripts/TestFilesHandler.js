const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { getNewFileName, getNewFileContent } = require('./utils');

class TestFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
    //
    this.oneTestDir = path.join(__dirname, '..', 'src', 'test', 'ones');
    this.newTestDir = `./src/test/${plural}`;
  }

  deleteTestFiles() {
    if (!fs.existsSync(this.newTestDir)) return;

    fs.readdir(this.oneTestDir, (err, files) => {
      if (err) {
        console.log(err);
      }

      console.log(chalk.blue('Deleting test files...'));
      let modifiedCount = 0;

      files.forEach((filename) => {
        const newTestFileName = getNewFileName(
          filename,
          this.singular,
          this.plural,
        );
        const newTestFilePath = path.join(this.newTestDir, newTestFileName);
        const oneTestFilePath = path.join(this.oneTestDir, filename);

        // compare
        const generatedContent = getNewFileContent(
          oneTestFilePath,
          this.singular,
          this.plural,
        );

        if (!fs.existsSync(newTestFilePath)) {
          modifiedCount++;
          return;
        }

        const currentContent = fs.readFileSync(newTestFilePath, {
          encoding: 'utf-8',
        });

        if (generatedContent === currentContent) {
          fs.rmSync(newTestFilePath);
          console.log(chalk.green(`${newTestFileName} deleted!`));
        } else {
          console.log(
            chalk.red(
              `Can not delete ${newTestFileName} because it has been modified`,
            ),
          );
        }
      });

      try {
        fs.rmdirSync(this.newTestDir);
      } catch (err) {}
    });
  }

  generateTestFiles() {
    if (fs.existsSync(this.newTestDir)) {
      console.log(chalk.red(`${this.newTestDir} already exists!`));
      return;
    }

    fs.mkdirSync(this.newTestDir, { recursive: true });
    console.log(chalk.blue('\nGenerating test files....'));

    const testDir = path.join(__dirname, '..', 'src', 'test', 'ones');
    fs.readdir(testDir, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }

      files.forEach((file) => {
        const testFilePath = path.join(this.oneTestDir, file);
        const newTestFileName = getNewFileName(
          file,
          this.singular,
          this.plural,
        );
        const newTestFilePath = path.join(this.newTestDir, newTestFileName);
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
