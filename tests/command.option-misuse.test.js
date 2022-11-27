import { expect, it } from "bun:test";
import { throws } from 'node:assert'
import { Command, Option } from '../index.js';

// It is a reasonable and easy mistake to pass Option to .option(). Detect this
// and offer advice.

const expectedMessage = 'To add an Option object use addOption() instead of option() or requiredOption()';

it('when pass Option to .option() then throw', () => {
  const program = new Command();

  throws(() => {
    program.option(new Option('-d, debug'));
  }, { message: expectedMessage });
});

it('when pass Option to .requiredOption() then throw', () => {
  const program = new Command();

  throws(() => {
    program.requiredOption(new Option('-d, debug'));
  }, { message: expectedMessage });
});
