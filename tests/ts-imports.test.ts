import { describe, expect, it } from "bun:test";
import { program, Command, Option, CommanderError, InvalidArgumentError, InvalidOptionArgumentError, Help, createCommand } from '../';
import * as commander from '../';

// Do some simple checks that expected imports are available at runtime.
// Similar tests to esm-imports-test.js

// eslint-disable-next-line @typescript-eslint/ban-types
function checkClass(obj: object, name: string): void {
  expect(typeof obj).toEqual('object');
  expect(obj.constructor.name).toEqual(name);
}

it('legacy default export of global Command', () => {
  checkClass(commander, 'Command');
});

it('program', () => {
  checkClass(program, 'Command');
});

it('createCommand', () => {
  checkClass(createCommand(), 'Command');
});

it('Command', () => {
  checkClass(new Command('name'), 'Command');
});

it('Option', () => {
  checkClass(new Option('-e, --example', 'description'), 'Option');
});

it('CommanderError', () => {
  checkClass(new CommanderError(1, 'code', 'failed'), 'CommanderError');
});

it('InvalidArgumentError', () => {
  checkClass(new InvalidArgumentError('failed'), 'InvalidArgumentError');
});

it('InvalidOptionArgumentError', () => { // Deprecated
  checkClass(new InvalidOptionArgumentError('failed'), 'InvalidArgumentError');
});

it('Help', () => {
  checkClass(new Help(), 'Help');
});
