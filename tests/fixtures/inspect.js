#!/usr/bin/env bun

const program = require('../../');

program
  .command('sub', 'install one or more packages')
  .parse(process.argv);
