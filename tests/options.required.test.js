import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert'
import commander from '../index.js';
import sinon from 'sinon'

// option with required value, no default
describe('option with required value, no default', () => {
  it('when option not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type');
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBeUndefined();
  });

  it('when option specified then value is as specified', () => {
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type');
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.opts().cheese).toBe(cheeseType);
  });

  it('when option value not specified then error', () => {
    // Arrange. Mock error routine to allow interception.
    const mockOptionMissingArgument = sinon.spy(() => {
      throw new Error('optionMissingArgument');
    });
    const program = new commander.Command();
    program.optionMissingArgument = mockOptionMissingArgument;
    program
      .option('--cheese <type>', 'cheese type');

    // Act. The throw is due to the above mock, and not default behaviour.
    throws(() => {
      program.parse(['node', 'test', '--cheese']);
    })

    // Assert
    expect(mockOptionMissingArgument.called).toBe(true);
  });
});

// option with required value, with default
describe('option with required value, with default', () => {
  it('when option not specified then value is default', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', defaultValue);
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBe(defaultValue);
  });

  it('when option specified then value is as specified', () => {
    const defaultValue = 'default';
    const program = new commander.Command();
    program
      .option('--cheese <type>', 'cheese type', defaultValue);
    const cheeseType = 'blue';
    program.parse(['node', 'test', '--cheese', cheeseType]);
    expect(program.opts().cheese).toBe(cheeseType);
  });

  it('when option value not specified then error', () => {
    // Arrange. Mock error routine to allow interception.
    const mockOptionMissingArgument = sinon.spy(() => {
      throw new Error('optionMissingArgument');
    });
    const defaultValue = 'default';
    const program = new commander.Command();
    program.optionMissingArgument = mockOptionMissingArgument;
    program
      .option('--cheese <type>', 'cheese type', defaultValue);

    // Act. The throw is due to the above mock, and not default behaviour.
    throws(() => {
      program.parse(['node', 'test', '--cheese']);
    })

    // Assert
    expect(mockOptionMissingArgument.called).toBe(true);
  });
});
