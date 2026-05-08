#!/usr/bin/env node
'use strict';

const { ensureStore, getDataPath } = require('../src/storage');
const { version } = require('../package.json');

function printHelp() {
  console.log(`bookmark ${version}

Usage:
  bookmark --help
  bookmark --version
  bookmark init
  bookmark storage-path
`);
}

function main(argv = process.argv.slice(2)) {
  const [command] = argv;

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return 0;
  }

  if (command === '--version' || command === '-v') {
    console.log(version);
    return 0;
  }

  if (command === 'storage-path') {
    console.log(getDataPath());
    return 0;
  }

  if (command === 'init') {
    const store = ensureStore();
    console.log(store.path);
    return 0;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  return 1;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main };
