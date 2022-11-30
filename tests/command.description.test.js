import { describe, expect, it } from "bun:test";
import commander from '../index.js';

it('when set description then get description', () => {
  const program = new commander.Command();
  const description = 'abcdef';
  program.description(description);
  expect(program.description()).toEqual(description);
});
