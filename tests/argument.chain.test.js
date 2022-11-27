import { describe, expect, it } from "bun:test";
import { Argument } from '../index.js';

describe('Argument methods that should return this for chaining', () => {
  it('when call .default() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.default(3);
    expect(result).toBe(argument);
  });

  it('when call .argParser() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argParser(() => { });
    expect(result).toBe(argument);
  });

  it('when call .choices() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.choices(['a']);
    expect(result).toBe(argument);
  });

  it('when call .argRequired() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argRequired();
    expect(result).toBe(argument);
  });

  it('when call .argOptional() then returns this', () => {
    const argument = new Argument('<value>');
    const result = argument.argOptional();
    expect(result).toBe(argument);
  });
});
