# Perf Test POC
> This POC uses [artillery](https://www.artillery.io/) as the test script. 

> Therefore, all test scripts are written in `yaml/yml` files and are located at `src/test-scripts`. There are examples of how to write them in that folder using the beloved [jsonplaceholder mock api](https://jsonplaceholder.typicode.com/).

> You may use that for reference to create you own test scripts.

## Requirement
- Node `16.16.0 and up`
- NPM `8.11.0 and up`
- Yarn: `yarn` is used to run test **programatically**. it needs to be installed globally with `npm i -g yarn`

## Steps to run
- Clone repo
- Run `yarn` or `npm install`
- Add test scripts under `src/test-scripts`
- So far, you can only run test scripts by name using the command `yarn test by-name {test-file-name}`. 

> `test-file-name` matches the any file in `src/test-scripts` with a **starts with** check. Eg. If you have two files that start with **get-post**, it will run them sequentially.

> You may also use `npm run test by-name {test-file-name}` to run any test

## Commands
| command   | options                                       |
| --------- | --------------------------------------------- |
| `by-name` | `-r`: generate report, `-i`: ignore tls check |

## Folder Structure
- root
  - src
    - assets `[directory to house all files you might use/upload in your test].`
    - processors `[directory to house all custom js modules you might run in a post or pre stage of your test].` head over [here](https://www.artillery.io/docs/guides/guides/http-reference#writing-custom-logic-in-javascript) to learn more.
    - reports `[directory to house all json reports of test runs].` will only generate report when `-r` option is used with `by-name` command.
    - seed `directory to house all csv data you might want to use in your test as seed data.` head over [here](https://www.artillery.io/docs/guides/getting-started/writing-your-first-test#injecting-data-from-an-external-file) to learn more.
    - test-scripts `[directory to house all artillery written test scripts in yaml/yml format]`
    - index.mts `[file to house runner logic].` should not be modified or deleted.
    - utility.mts `[file to house helper functions used for running tests].` should not be modified or deleted.
  - .node-version `[required node version indicator].` should not be modified or deleted.

## Documentation
Head over to [artillery](https://www.artillery.io/) to read about how to create all sorts of load/performance and general function api tests.

## Modification
You are free to modify and extend this POC. The name my change as I make improvments and POC flag will be removed.