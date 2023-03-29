const fs = require('fs');
const path = require('path');
const { describe } = require('yargs');
const cwd = process.cwd();

//
const {
  isValidResourceName,
  testFilesAlreadyExist,
  codeFilesAlreadyExist,
} = require('../common');

describe('isValidResourceName', () => {
  it('should return false if resource name contain number', () => {
    expect(isValidResourceName('jaja1')).toBe(false);
  });

  it('should return false if resource name contain space', () => {
    expect(isValidResourceName('ja ja')).toBe(false);
  });

  it('should return trimmed, lowercase resource name if it is valid ', () => {
    expect(isValidResourceName('Jaja')).toBe('jaja');
  });

  it('should be valid resouce name even it has trailing space or heading space', () => {
    expect(isValidResourceName(' Jaja')).toBe('jaja');
    expect(isValidResourceName('Jaja ')).toBe('jaja');
    expect(isValidResourceName('  Jaja ')).toBe('jaja');
  });
});

describe('testFilesAlreadyExist', () => {
  it('should return true if the test folder already exists', () => {
    const testFolderPath = path.join(cwd, 'src', 'test', 'mock-folder');
    fs.mkdirSync(testFolderPath);

    expect(testFilesAlreadyExist('mock-folder')).toBe(true);

    fs.rmdirSync(testFolderPath);
  });

  it('should return false if the test folder does not exist', () => {
    // invoke the function and expect it to return false
    expect(testFilesAlreadyExist('non-existent-folder')).toBe(false);
  });
});

describe('codeFilesAlreadyExists', () => {});
