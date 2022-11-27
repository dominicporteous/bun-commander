import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

describe('showHelpAfterError with message', () => {
  const customHelpMessage = 'See --help';

  function makeProgram() {
    const writeMock = sinon.spy();
    const program = new commander.Command();
    program
      .exitOverride()
      .showHelpAfterError(customHelpMessage)
      .configureOutput({ writeErr: writeMock });

    return { program, writeMock };
  }

  it('when missing command-argument then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.argument('<file>');
    let caughtErr;
    try {
      program.parse([], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.missingArgument');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  it('when missing option-argument then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.option('--output <file>');
    let caughtErr;
    try {
      program.parse(['--output'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.optionMissingArgument');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  it('when missing mandatory option then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.requiredOption('--password <cipher>');
    let caughtErr;
    try {
      program.parse([], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.missingMandatoryOptionValue');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  it('when unknown option then shows help', () => {
    const { program, writeMock } = makeProgram();
    let caughtErr;
    try {
      program.parse(['--unknown-option'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  it('when too many command-arguments then shows help', () => {
    const { program, writeMock } = makeProgram();
    program
      .allowExcessArguments(false);
    let caughtErr;
    try {
      program.parse(['surprise'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.excessArguments');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  it('when unknown command then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.command('sub1');
    let caughtErr;
    try {
      program.parse(['sub2'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownCommand');
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  });

  //WIP - possibly due to buns exception handling?
  /* it('when invalid option choice then shows help', () => {
    const { program, writeMock } = makeProgram();
    program.addOption(new commander.Option('--color').choices(['red', 'blue']));
    let caughtErr;
    throws(() => program.parse(['--color', 'pink'], { from: 'user' }));
    expect(writeMock.lastCall.args[0]).toEqual(`${customHelpMessage}\n`);
  }); */
});

it('when showHelpAfterError() and error and then shows full help', () => {
  const writeMock = sinon.spy();
  const program = new commander.Command();
  program
    .exitOverride()
    .showHelpAfterError()
    .configureOutput({ writeErr: writeMock });

  try {
    program.parse(['--unknown-option'], { from: 'user' });
  } catch (err) {
  }
  expect(writeMock.lastCall.args[0]).toEqual(program.helpInformation());
});

