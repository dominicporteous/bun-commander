import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Low-level tests of setting Argument.required.
// Higher level tests of optional/required arguments elsewhere.

it('when name with surrounding <> then argument required', () => {
  const argument = new commander.Argument('<name>');
  expect(argument.required).toBe(true);
});

it('when name with surrounding [] then argument optional', () => {
  const argument = new commander.Argument('[name]');
  expect(argument.required).toBe(false);
});

it('when name without surrounding brackets then argument required', () => {
  // default behaviour, allowed from Commander 8
  const argument = new commander.Argument('name');
  expect(argument.required).toBe(true);
});

it('when call .argRequired() then argument required', () => {
  const argument = new commander.Argument('name');
  argument.required = false;
  argument.argRequired();
  expect(argument.required).toBe(true);
});

it('when call .argOptional() then argument optional', () => {
  const argument = new commander.Argument('name');
  argument.required = true;
  argument.argOptional();
  expect(argument.required).toBe(false);
});
