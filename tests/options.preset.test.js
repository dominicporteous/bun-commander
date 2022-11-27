import { expect, it } from "bun:test";
import { Command, Option } from '../index.js';

it('when boolean option with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-d, --debug').preset('foo'));
  program.parse(['-d'], { from: 'user' });
  expect(program.opts().debug).toBe('foo');
});

it('when boolean option with number preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-d, --debug').preset(80));
  program.parse(['-d'], { from: 'user' });
  expect(program.opts().debug).toBe(80);
});

it('when optional with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset('foo'));
  program.parse(['-p'], { from: 'user' });
  expect(program.opts().port).toBe('foo');
});

it('when optional with number preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset(80));
  program.parse(['-p'], { from: 'user' });
  expect(program.opts().port).toBe(80);
});

it('when optional with string preset used with option-argument then value is as specified', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset('foo'));
  program.parse(['-p', '1234'], { from: 'user' });
  expect(program.opts().port).toBe('1234');
});

it('when optional with preset and coerce used then preset is coerced', () => {
  const program = new Command();
  program.addOption(new Option('-p, --port [port]').preset('4').argParser(parseFloat));
  program.parse(['-p'], { from: 'user' });
  expect(program.opts().port).toBe(4);
});

it('when optional with preset and variadic used then preset is concatenated', () => {
  const program = new Command();
  program.addOption(new Option('-n, --name [name...]').preset('two'));
  program.parse(['-n', 'one', '-n', '-n', 'three'], { from: 'user' });
  expect(program.opts().name).toEqual(['one', 'two', 'three']);
});

it('when negated with string preset used then value is preset', () => {
  const program = new Command();
  program.addOption(new Option('--no-colour').preset('foo'));
  program.parse(['--no-colour'], { from: 'user' });
  expect(program.opts().colour).toBe('foo');
});
