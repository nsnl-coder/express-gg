# Express-gg: express great generator

## How to install

Install it globally:

```bash
  npm i -g express-gg
```

Install it locally:

```bash
  npm i express-gg --save-dev
```

## Generate files

if you install the package globally, simply just run express and follow the instruction:

```bash
  express
```

Or, if you install it locally:

```bash
  npx express
```

## This command with generate 4 files with sample codes:

- `controller`: already implement `crud operations` handler
- `model`: contains mongoose schema
- `routes`: contains all common route needed for a resource
- `yupschema`: this schema is used to define data validation rules

## Generate test files

If you choose to generate test files, you got 35 pre-written test for all the routes.  
These are the common tests that are the same for every resource.  
Therefore, you need to add more tests specific to every route such as auth tests.

## Delete Files

if you install the package globally, simply just run express and follow the instruction:

```bash
  express -d
```

Or, if you install it locally:

```bash
  npx express -d
```

This command only delete the files that are not modified since generated.

## Add your router to express app

Don't forget to add your router to express app to make it run.

```js
const express = require('express');
const app = express();

app
  .use
  // import your router and put it here
  ();
```

## Dependencies

You should only install this package as dev dependecies.

### what are test_number, test_string, test_any?

These fields are being used to run test only, if you don't write test, simply just remove them.
