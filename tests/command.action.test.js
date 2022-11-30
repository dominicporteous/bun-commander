
import { expect, it } from "bun:test";
import { throws } from 'node:assert';
import commander from '../index.js';
import sinon from 'sinon'

// Test some behaviours of .action not covered in more specific tests.

it('when .action called then command passed to action', () => {
  const actionMock = sinon.spy();
  const program = new commander.Command();
  const cmd = program
    .command('info')
    .action(actionMock);
  program.parse(['node', 'test', 'info']);
  expect(actionMock.lastCall.args).toEqual([cmd.opts(), cmd]);
});

it('when .action called then this is set to command', () => {
  const program = new commander.Command();
  let actionThis;
  const cmd = program
    .command('info')
    .action(function() { actionThis = this; });
  program.parse(['node', 'test', 'info']);
  expect(actionThis).toBe(cmd);
});

it('when .action called then program.args only contains args', () => {
  // At one time program.args was being modified to contain the same args as the call to .action
  // and so included the command as an extra and unexpected complex item in array.
  const program = new commander.Command();
  program
    .command('info <file>')
    .action(() => {});
  program.parse(['node', 'test', 'info', 'my-file']);
  expect(program.args).toEqual(['info', 'my-file']);
});

for(const [methodName, program] of getTestCases('<file>')){
  it(`when .action on program with required argument via ${methodName} and argument supplied then action called`, () => {
    const actionMock = sinon.spy();
    program.action(actionMock);
    program.parse(['node', 'test', 'my-file']);
    expect(actionMock.lastCall.args).toEqual(['my-file', program.opts(), program]);
  });
}

for(const [methodName, program] of getTestCases('<file>')){
  it(`when .action on program with required argument via ${methodName} and argument not supplied then action not called`, () => {
    const actionMock = sinon.spy();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .action(actionMock);
    throws(() => {
      program.parse(['node', 'test']);
    });
    expect(actionMock.called).toBe(false);
  });
}

// Changes made in #729 to call program action handler
it('when .action on program and no arguments then action called', () => {
  const actionMock = sinon.spy();
  const program = new commander.Command();
  program
    .action(actionMock);
  program.parse(['node', 'test']);
  expect(actionMock.lastCall.args).toEqual([program.opts(), program]);
});

for(const [methodName, program] of getTestCases('[file]')){
  it(`when .action on program with optional argument via ${methodName} supplied then action called`, () => {
    const actionMock = sinon.spy();
    program.action(actionMock);
    program.parse(['node', 'test', 'my-file']);
    expect(actionMock.lastCall.args).toEqual(['my-file', program.opts(), program]);
  });
}

for(const [methodName, program] of getTestCases('[file')){
  it('when .action on program without optional argument supplied then action called', () => {
    const actionMock = sinon.spy();
    program.action(actionMock);
    program.parse(['node', 'test']);
    expect(actionMock.lastCall.args).toEqual([undefined, program.opts(), program]);
  });
}

for(const [methodName, program] of getTestCases('[file')){
  it(`when .action on program with optional argument via ${methodName} and subcommand and program argument then program action called`, () => {
    const actionMock = sinon.spy();
    program.action(actionMock);
    program
      .command('subcommand');

    program.parse(['node', 'test', 'a']);

    expect(actionMock.lastCall.args).toEqual(['a', program.opts(), program]);
  });
}

// Changes made in #1062 to allow this case
for(const [methodName, program] of getTestCases('[file')){
  it(`when .action on program with optional argument via %{methodName} and subcommand and no program argument then program action called`, () => {
    const actionMock = sinon.spy();
    program.action(actionMock);
    program.command('subcommand');

    program.parse(['node', 'test']);

    expect(actionMock.lastCall.args).toEqual([undefined, program.opts(), program]);
  });
}

it('when action is async then can await parseAsync', async() => {
  let asyncFinished = false;
  async function delay() {
    await new Promise(resolve => setTimeout(resolve, 100));
    asyncFinished = true;
  }
  const program = new commander.Command();
  program
    .action(delay);

  const later = program.parseAsync(['node', 'test']);
  expect(asyncFinished).toBe(false);
  await later;
  expect(asyncFinished).toBe(true);
});

function getTestCases(arg) {
  const withArguments = new commander.Command().arguments(arg);
  const withArgument = new commander.Command().argument(arg);
  const withAddArgument = new commander.Command().addArgument(new commander.Argument(arg));
  return [['.arguments', withArguments], ['.argument', withArgument], ['.addArgument', withAddArgument]];
}
