import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import path from 'node:path';

it('when construct with name then name is set', () => {
  const program = new commander.Command('foo');
  expect(program.name()).toBe('foo');
});

it('when set program name and parse then name is as assigned', () => {
  const program = new commander.Command();
  program.name('custom');
  program.parse(['node', 'test']);
  expect(program.name()).toBe('custom');
});

it('when program name not set and parse with script argument then plain name is found from script name', () => {
  const program = new commander.Command();
  program.parse(['node', path.resolve(process.cwd(), 'script.js')], { from: 'node' });
  expect(program.name()).toBe('script');
});

it('when command name not set and no script argument in parse then name is program', () => {
  const program = new commander.Command();
  program.parse([], { from: 'user' });
  expect(program.name()).toBe('program');
});

it('when add command then command is named', () => {
  const program = new commander.Command();
  const subcommand = program
    .command('mycommand <file>');
  expect(subcommand.name()).toBe('mycommand');
});

it('when set program name then name appears in help', () => {
  const program = new commander.Command();
  program.name('custom-name');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toContain('Usage: custom-name');
});

it('when pass path to nameFromFilename then name is plain name', () => {
  const program = new commander.Command();
  program.nameFromFilename(path.resolve(process.cwd(), 'foo.js'));
  expect(program.name()).toBe('foo');
});

it('when pass __filename to nameFromFilename then name is plain name of this file', () => {
  const program = new commander.Command();
  program.nameFromFilename(__filename);
  expect(program.name()).toBe('command.name.test');
});
