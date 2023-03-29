//  generate file: controller, model, routes, testFile

// user type command: express g user users product products

// for each pair of input, do:

// 1. Check for environment

// check if user is at root folder by checking package.json
// if user is not at root folder, return an error

// check if controller, model, routes file already exist
// if one of these file already exist, return an error

// check if test folder of the resoure already exist
// if resource test folder exist, stop and return error

// 2. implementation

// write a function that accept a filename & output folder route

// read that file in to a variable and then replace

// Ones => Abcs
// ones => abcs
// one => abc
// One => Abc

// write model file to src/models with new name
// write controller file to src/controllers with new name
// write routes file to src/routes with new name
// write test files to src/test/ with new name

const fs = require('fs');

// function readFile(filename) {}

// console.clear();

// let data = fs.readFileSync('./code.js', { encoding: 'utf-8' });

// data = data.replaceAll('Ones', 'Twos');
// data = data.replaceAll('ones', 'twos');
// data = data.replaceAll('one', 'two');
// data = data.replaceAll('One', 'Two');

// console.log(fs.existsSync('./codeTest.js'));

// fs.writeFileSync('./haha/codeTest.js', data);

// fs.mkdir('./haha/hihi', { recursive: true }, () => {});

var prompt = require('prompt-sync')({ sigint: true });

var n = prompt('How many more times? ');

console.log(n);

fs.promises.access();
