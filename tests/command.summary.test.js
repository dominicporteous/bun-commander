import { describe, expect, it } from "bun:test";
import commander from '../index.js';

it('when set summary then get summary', () => {
  const program = new commander.Command();
  const summary = 'abcdef';
  program.summary(summary);
  expect(program.summary()).toEqual(summary);
});
