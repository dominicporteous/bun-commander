import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Do some testing of the default export(s).

it('when require commander then is a Command (default export of global)', () => {
  // Deprecated global command
  const program = commander;
  expect(program.constructor.name).toBe('Command');
});

it('when require commander then has program (named export of global)', () => {
  // program added in v5
  const program = commander.program;
  expect(program.constructor.name).toBe('Command');
});

it('when require commander then has newable Command', () => {
  const cmd = new commander.Command();
  expect(cmd.constructor.name).toBe('Command');
});
