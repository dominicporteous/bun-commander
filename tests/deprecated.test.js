import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Test for backwards compatible behaviour of deprecated features that don't fit in elsewhere.
// We keep deprecated features working (when not too difficult) to avoid breaking existing code
// and reduce barriers to updating to latest version of Commander.

describe('option with regular expression instead of custom processing function', () => {
  it('when option not given then value is default', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse([], { from: 'user' });
    expect(program.opts().cheese).toEqual('mild');
  });

  it('when argument matches regexp then value is as specified', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'tasty'], { from: 'user' });
    expect(program.opts().cheese).toEqual('tasty');
  });

  it('when argument does mot matches regexp then value is default', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', /mild|tasty/, 'mild');
    program.parse(['--cheese', 'other'], { from: 'user' });
    expect(program.opts().cheese).toEqual('mild');
  });
});
