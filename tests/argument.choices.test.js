import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert';
import commander from '../index.js';

it('when command argument in choices then argument set', () => {
  const program = new commander.Command();
  let shade;
  program
    .exitOverride()
    .addArgument(new commander.Argument('<shade>').choices(['red', 'blue']))
    .action((shadeParam) => { shade = shadeParam; });
  program.parse(['red'], { from: 'user' });
  expect(shade).toBe('red');
});

it('when command argument is not in choices then error', () => {
  // Lightweight check, more detailed testing of behaviour in command.exitOverride.test.js
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({
      writeErr: () => {}
    })
    .addArgument(new commander.Argument('<shade>').choices(['red', 'blue']));
    throws(() => {
    program.parse(['orange'], { from: 'user' });
  });
});

describe('choices parameter is treated as readonly, per TypeScript declaration', () => {
  it('when choices called then parameter does not change', () => {
    // Unlikely this could break, but check the API we are declaring in TypeScript.
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    new commander.Argument('<shade>').choices(param);
    expect(param).toEqual(original);
  });

  it('when choices called and argChoices later changed then parameter does not change', () => {
    const original = ['red', 'blue', 'green'];
    const param = original.slice();
    const argument = new commander.Argument('<shade>').choices(param);
    argument.argChoices.push('purple');
    expect(param).toEqual(original);
  });

  it('when choices called and parameter changed the choices does not change', () => {
    const program = new commander.Command();
    const param = ['red', 'blue'];
    program
      .exitOverride()
      .configureOutput({
        writeErr: () => {}
      })
      .addArgument(new commander.Argument('<shade>').choices(param));
    param.push('orange');
    throws(() => {
      program.parse(['orange'], { from: 'user' });
    });
  });
});
