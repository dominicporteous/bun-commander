import { describe, expect, it } from "bun:test";
import { doesNotThrow, throws } from 'node:assert';  
import commander from '../index.js';
import sinon from 'sinon'

it('when default writeErr() then error on stderr', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const program = new commander.Command();
  program.exitOverride();

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
  }

  expect(writeSpy.calledOnce).toBe(true);
  expect(writeSpy.lastCall.args[0]).toBe(Bun.stderr)
  writeSpy.restore();
});

it('when custom writeErr() then error on custom output', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const customWrite = sinon.spy();
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({ writeErr: customWrite });

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
  }

  expect(writeSpy.called).toBe(false);
  expect(customWrite.calledOnce).toBe(true);
  writeSpy.restore();
});

it('when default write() then version on stdout', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });

  const program = new commander.Command();
  program
    .exitOverride()
    .version('1.2.3');

  // This should throw - https://github.com/oven-sh/bun/issues/1556
  doesNotThrow(() => {
    program.parse(['--version'], { from: 'user' });
  });

  expect(writeSpy.calledOnce).toBe(true);
  expect(writeSpy.lastCall.args[0]).toBe(Bun.stdout)

  writeSpy.restore();
});

it('when custom write() then version on custom output', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const customWrite = sinon.spy();
  const program = new commander.Command();
  program
    .exitOverride()
    .version('1.2.3')
    .configureOutput({ writeOut: customWrite });

  // This should throw - https://github.com/oven-sh/bun/issues/1556
  doesNotThrow(() => {
    program.parse(['--version'], { from: 'user' });
  })

  expect(writeSpy.called).toBe(false);
  expect(customWrite.calledOnce).toBe(true);

  writeSpy.restore();
});

it('when default write() then help on stdout', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });

  const program = new commander.Command();
  program.outputHelp();

  expect(writeSpy.called).toBe(true);
  expect(writeSpy.lastCall.args[0]).toBe(Bun.stdout)

  writeSpy.restore();
});

it('when custom write() then help error on custom output', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const customWrite = sinon.spy();
  const program = new commander.Command();
  program.configureOutput({ writeOut: customWrite });
  program.outputHelp();

  expect(writeSpy.called).toBe(false);
  expect(customWrite.called).toBe(true);

  writeSpy.restore();
});

it('when default writeErr then help error on stderr', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const program = new commander.Command();
  program.outputHelp({ error: true });

  expect(writeSpy.called).toBe(true);
  expect(writeSpy.lastCall.args[0]).toBe(Bun.stderr)
  writeSpy.restore();
});


it('when custom writeErr then help error on custom output', () => {
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const customWrite = sinon.spy();
  const program = new commander.Command();
  program.configureOutput({ writeErr: customWrite });
  program.outputHelp({ error: true });

  expect(writeSpy.called).toBe(false);
  expect(customWrite.calledOnce).toBe(true);
  writeSpy.restore();
});

it('when default getOutHelpWidth then help helpWidth from stdout', () => {
  const expectedColumns = 123;
  const holdIsTTY = Bun.stdout.isTTY;
  const holdColumns = Bun.stdout.columns;
  let helpWidth;

  Bun.stderr.isTTY = true;
  Bun.stdout.columns = expectedColumns;
  Bun.stdout.isTTY = true;
  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      }
    });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
  Bun.stdout.columns = holdColumns;
  Bun.stdout.isTTY = holdIsTTY;
});


it('when custom getOutHelpWidth then help helpWidth custom', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      }
    }).configureOutput({
      getOutHelpWidth: () => expectedColumns
    });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
});

it('when default getErrHelpWidth then help error helpWidth from stderr', () => {
  const expectedColumns = 123;
  const holdIsTTY = Bun.stderr.isTTY;
  const holdColumns = Bun.stderr.columns;
  let helpWidth;

  Bun.stderr.isTTY = true;
  Bun.stderr.columns = expectedColumns;
  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      }
    });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
  Bun.stderr.isTTY = holdIsTTY;
  Bun.stderr.columns = holdColumns;
});

it('when custom getErrHelpWidth then help error helpWidth custom', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      }
    }).configureOutput({
      getErrHelpWidth: () => expectedColumns
    });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
});

it('when custom getOutHelpWidth and configureHelp:helpWidth then help helpWidth from configureHelp', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
      helpWidth: expectedColumns
    }).configureOutput({
      getOutHelpWidth: () => 999
    });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
});

it('when custom getErrHelpWidth and configureHelp:helpWidth then help error helpWidth from configureHelp', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
      helpWidth: expectedColumns
    }).configureOutput({
      getErrHelpWidth: () => 999
    });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
});

it('when set configureOutput then get configureOutput', () => {
  const outputOptions = {
    writeOut: sinon.spy(),
    writeErr: sinon.spy(),
    getOutHelpWidth: sinon.spy(),
    getErrHelpWidth: sinon.spy(),
    outputError: sinon.spy()
  };
  const program = new commander.Command();
  program.configureOutput(outputOptions);
  expect(program.configureOutput()).toEqual(outputOptions);
});

it('when custom outputErr and error then outputErr called', () => {
  const outputError = sinon.spy();
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({
      outputError
    });

  throws(() => {
    program.parse(['--unknownOption'], { from: 'user' });
  });
  expect(outputError.lastCall.args).toEqual(["error: unknown option '--unknownOption'\n", program._outputConfiguration.writeErr]);
});

it('when custom outputErr and writeErr and error then outputErr passed writeErr', () => {
  const writeErr = () => sinon.spy();
  const outputError = sinon.spy();
  const program = new commander.Command();
  program
    .exitOverride()
    .configureOutput({ writeErr, outputError });

  throws(() => {
    program.parse(['--unknownOption'], { from: 'user' });
  });
  expect(outputError.lastCall.args).toEqual(["error: unknown option '--unknownOption'\n", writeErr]);
});