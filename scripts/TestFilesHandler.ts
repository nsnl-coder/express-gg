import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import {
  getNewFileName,
  getNewFileContent,
  files,
  checkDevDependencies,
  readPackageJson,
} from './utils';

class TestFilesHandler {
  cwd: string;
  oneTestDir = path.join(__dirname, '..', 'src', 'test', 'ones');
  newTestDir: string;
  files;

  constructor(public singular: string, public plural: string) {
    this.cwd = process.cwd();
    this.newTestDir = `./src/test/${plural}`;
    this.files = files(singular);
  }

  deleteTestFiles() {
    if (!fs.existsSync(this.newTestDir)) return;

    fs.readdir(this.oneTestDir, (err, files) => {
      if (err) {
        console.log(err);
      }

      console.log(chalk.blue('Deleting test files...'));

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

        if (!fs.existsSync(newTestFilePath)) return;

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

    const files = fs.readdirSync(testDir);

    files.forEach((file) => {
      const testFilePath = path.join(this.oneTestDir, file);
      const newTestFileName = getNewFileName(file, this.singular, this.plural);
      const newTestFilePath = path.join(this.newTestDir, newTestFileName);
      const newTestContent = getNewFileContent(
        testFilePath,
        this.singular,
        this.plural,
      );

      if (!newTestContent) {
        console.error('Can not generate new test file content!');
        return;
      }

      fs.writeFileSync(newTestFilePath, newTestContent);
      console.log(chalk.green(`${newTestFileName} created!`));
    });
  }

  setupTests() {
    const { newPackageJsonContent, onePackageJsonContent } = readPackageJson();

    // add scripts
    if (!newPackageJsonContent.jest) {
      newPackageJsonContent.jest = onePackageJsonContent.jest;
    }

    if (!newPackageJsonContent.scripts.test) {
      newPackageJsonContent.scripts = {
        ...newPackageJsonContent.scripts,
        test: 'jest',
      };
    }
    fs.writeFileSync('./package.json', JSON.stringify(newPackageJsonContent));

    // check for setup.js file
    if (!fs.existsSync(this.files.newSetupTestPath)) {
      if (!fs.existsSync('src/test')) fs.mkdirSync('src/test');
      const oneSetupFileContent = fs.readFileSync(this.files.oneSetupTestPath);
      fs.writeFileSync(this.files.newSetupTestPath, oneSetupFileContent);
      console.log(chalk.blue('src/test/setup.js file created'));
    }

    // check for dev dependencies
    const isMissingDevDependencies = checkDevDependencies(
      'jest',
      'mongodb-memory-server',
      'nodemon',
      'supertest',
    );

    return isMissingDevDependencies;
  }
}

export default TestFilesHandler;
