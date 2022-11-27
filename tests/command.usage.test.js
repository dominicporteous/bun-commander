import { describe, expect, it } from "bun:test";
import commander from '../index.js';

it('when default usage and check program help then starts with default usage', () => {
  const program = new commander.Command();

  program.name('test');
  const helpInformation = program.helpInformation();

  expect(helpInformation.startsWith('Usage: test [options]')).toBe(true);
});

it('when custom usage and check program help then starts with custom usage', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  program
    .usage(myUsage);

  program.name('test');
  const helpInformation = program.helpInformation();

  expect(helpInformation.startsWith(`Usage: test ${myUsage}`)).toBe(true);
});

it('when default usage and check subcommand help then starts with default usage including program name', () => {
  const program = new commander.Command();
  const subCommand = program
    .command('info');

  program.name('test');
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation.startsWith('Usage: test info [options]')).toBe(true);
});

it('when custom usage and check subcommand help then starts with custom usage including program name', () => {
  const myUsage = 'custom';
  const program = new commander.Command();
  const subCommand = program
    .command('info')
    .usage(myUsage);

  program.name('test');
  const helpInformation = subCommand.helpInformation();

  expect(helpInformation.startsWith(`Usage: test info ${myUsage}`)).toBe(true);
});

it('when has option then [options] included in usage', () => {
  const program = new commander.Command();

  program
    .option('--foo');

  expect(program.usage().includes('[options]')).toBe(true);
});

it('when no options then [options] not included in usage', () => {
  const program = new commander.Command();

  program
    .helpOption(false);

    expect(program.usage().includes('[options]')).toBe(false);
});

it('when has command then [command] included in usage', () => {
  const program = new commander.Command();

  program
    .command('foo');

    expect(program.usage().includes('[command]')).toBe(true);
});

it('when no commands then [command] not included in usage', () => {
  const program = new commander.Command();

  expect(program.usage().includes('[command]')).toBe(false);
});

it('when argument then argument included in usage', () => {
  const program = new commander.Command();

  program
    .argument('<file>');

    expect(program.usage().includes('<file>')).toBe(true);
});

it('when options and command and argument then all three included in usage', () => {
  const program = new commander.Command();

  program
    .argument('<file>')
    .option('--alpha')
    .command('beta');

  expect(program.usage()).toBe('[options] [command] <file>');
});
