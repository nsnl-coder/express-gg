# Express-gg: express great generator

## How to install

Install it globally:

```bash
$  npm i -g express-gg
```

Install it locally:

```bash
$  npm i express-gg --save-dev
```

## Initialize new project

```bash
$  gg init
```

`gg init` will create common express folders and files. After running the command, you can run:

```bash
$  npm start
```

## `gg` command

You can use `gg` command to generate codes.

Before running `gg`, you need to add mongodb connection string to .env file:

```
  CONNECTION_STRING= <put-your-connection-string-here>
```

Also, `gg` command only run when your working directory is clean. If your current directory is not a git repo:

```bash
  $ git init
  $ git add .
  $ git commit -m "inital commit"
```

if you install the package globally, simply just run `gg` and follow the instruction:

```bash
  gg
```

Or, if you install it locally:

```bash
  npx gg
```

## `gg` command with generate 5 files with sample codes:

- `controller`: already implement `crud operations` handler
- `model`: contains mongoose schema
- `routes`: contains all common route needed for a resource
- `yupschema`: this schema is used to define data validation rules
- `postman`: sample postman collection, you can use this to import to postman

## Generate test files

If you choose to generate test files, you got 35 pre-written test for all the routes.  
These are the common tests that are the same for every resource.  
Therefore, you need to add more tests specific to every route such as auth tests.

When you run `gg` command and select tests, it will check if your project missing any packages, you need to install them:

```bash
  npm install
```

## Delete Files

if you install the package globally, simply just run express and follow the instruction:

```bash
  gg -d
```

**Or, if you install it locally:**

```bash
  npx gg -d
```

`gg -d` command only delete the files that `are not modified` in comparision with generated version.

## Dependencies

You should only install this package as dev dependecies.

### what are test_number, test_string, test_any?

These fields are being used to run test only, if you don't write test, simply just remove them.

### Notes

In `./src/routes/index.js`, there is one line of code:

```javascript
// #insert__routers
```

This line of code is used to auto import newly created router to your express app when you run `gg` command.
Don't delete it if you want auto import.
