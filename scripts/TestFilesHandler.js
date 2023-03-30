const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { getNewFileName, getNewFileContent, files } = require('./utils');

class TestFilesHandler {
  constructor(singular, plural) {
    this.cwd = process.cwd();

    this.singular = singular;
    this.plural = plural;
    //
    this.oneTestDir = path.join(__dirname, '..', 'src', 'test', 'ones');
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

  setupTests() {
    // check for package.json
    const newPackageJsonBuffer = fs.readFileSync(
      this.files.newPackageJsonPath,
      {
        encoding: 'utf-8',
      },
    );
    let newPackageJsonContent = JSON.parse(newPackageJsonBuffer);

    const onePackageJsonBuffer = fs.readFileSync(
      this.files.onePackageJsonPath,
      {
        encoding: 'utf-8',
      },
    );
    const onePackageJsonContent = JSON.parse(onePackageJsonBuffer);

    if (!newPackageJsonContent.jest) {
      newPackageJsonContent.jest = {
        testEnvironment: 'node',
        setupFileAfterEnv: ['./src/test/setup.js'],
      };
    }

    if (!newPackageJsonContent.scripts) {
      newPackageJsonContent.scripts = {};
    }

    if (!newPackageJsonContent.scripts.test) {
      newPackageJsonContent.scripts = {
        ...newPackageJsonContent.scripts,
        test: 'jest',
      };
    }

    // check for dev dependencies
    if (!newPackageJsonContent.devDependencies) {
      newPackageJsonContent.devDependencies = {};
    }

    const newDevDependencies = Object.keys(
      newPackageJsonContent.devDependencies,
    );

    const oneDevDependencies = Object.keys(
      onePackageJsonContent.devDependencies,
    );

    const isMissingDevDependencies = !oneDevDependencies.every((item) =>
      newDevDependencies.includes(item),
    );

    if (isMissingDevDependencies) {
      const missingDependencies = oneDevDependencies
        .filter((item) => !newDevDependencies.includes(item))
        .join(', ');

      newPackageJsonContent.devDependencies = {
        ...newPackageJsonContent.devDependencies,
        ...onePackageJsonContent.devDependencies,
      };

      console.log(
        chalk.green(
          `Added missing devDependencies to package.json: ${missingDependencies}`,
        ),
      );
    }

    fs.writeFileSync(
      this.files.newPackageJsonPath,
      JSON.stringify(newPackageJsonContent),
    );

    // check for setup.js file
    if (!fs.existsSync(this.files.newSetupTestPath)) {
      if (!fs.existsSync('src/test')) fs.mkdirSync('src/test');
      const oneSetupFileContent = fs.readFileSync(this.files.oneSetupTestPath);
      fs.writeFileSync(this.files.newSetupTestPath, oneSetupFileContent);
    }

    if (isMissingDevDependencies) return true;
  }
}

module.exports = TestFilesHandler;
