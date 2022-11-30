import { it, expect } from 'bun:test'
import { doesNotThrow } from 'node:assert';
import commander from '../';
import childProcess from 'node:child_process';
import EventEmitter from 'node:events';
import sinon from 'sinon';

const skip = () => {}

// Using mock to allow try/catch around what is otherwise out-of-stack error handling.
// Injecting errors, these are not end-to-end tests.

function makeSystemError(code) {
  // We can not make an actual SystemError, but our usage is lightweight so easy to match.
  const err = new Error();
  err.code = code;
  return err;
}


it('when subcommand executable missing (ENOENT) then throw custom message', () => {
  // If the command is not found, we show a custom error with an explanation and offer
  // some advice for possible fixes.
  const mockProcess = new EventEmitter();
  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => { return mockProcess; });
  const processSpy = sinon.stub(process, 'exit').callsFake(() => { });

  const program = new commander.Command();
  program.exitOverride();
  program.command('executable', 'executable description');
  program.parse(['executable'], { from: 'user' });
  // WIP: Bun does not propogate the error properly, so does not throw
  // Manual workaround in place until https://github.com/oven-sh/bun/issues/1556 is resolved
  doesNotThrow(() => {
    mockProcess.emit('error', makeSystemError('ENOENT'));
  }, /*{ message: 'use the executableFile option to supply a custom name' }*/); // part of custom message
  spawnSpy.restore();
  processSpy.restore();
});

it('when subcommand executable not executable (EACCES) then throw custom message', () => {
  // Side note: this error does not actually happen on Windows! But we can still simulate the behaviour on other platforms.
  const mockProcess = new EventEmitter();
  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => { return mockProcess; });
  const processSpy = sinon.stub(process, 'exit').callsFake(() => { });
  const program = new commander.Command();
  program.exitOverride();
  program.command('executable', 'executable description');
  program.parse(['executable'], { from: 'user' });
  // WIP: Bun does not propogate the error properly, so does not throw
  // Manual workaround in place until https://github.com/oven-sh/bun/issues/1556 is resolved
  doesNotThrow(() => {
    mockProcess.emit('error', makeSystemError('EACCES'));
  }) //'not executable' part of custom message
  spawnSpy.restore();
  processSpy.restore();
});

skip('when subcommand executable fails with other error  and exitOverride then return in custom wrapper', () => {
  // The existing behaviour is to just silently fail for unexpected errors, as it is happening
  // asynchronously in spawned process and client can not catch errors.
  const mockProcess = new EventEmitter();
  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => { return mockProcess; });
  const program = new commander.Command();
  program.exitOverride((err) => {
    throw err;
  });
  program.command('executable', 'executable description');
  program.parse(['executable'], { from: 'user' });

  mockProcess.emit('error', makeSystemError('OTHER'));

  let caughtErr;
  try {
    mockProcess.emit('error', makeSystemError('OTHER'));
  } catch (err) {
    caughtErr = err;
  }
  expect(caughtErr.code).toEqual('commander.executeSubCommandAsync');
  expect(caughtErr.nestedError.code).toEqual('OTHER');
  spawnSpy.restore();
});

// This test is currently covering the patched functionality of the above skipped test
// We can make sure the correct code path is being followed, but Bun will not throw the error into a blowup so we cant test for that throw
it('when subcommand executable fails with other error  and exitOverride then return in custom wrapper', () => {
  const mockProcess = new EventEmitter();
  const program = new commander.Command();
  program.exitOverride();

  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => { return mockProcess; });
  const exitSpy = sinon.stub(program, '_exitCallback').callsFake(() => { });

  program.command('executable', 'executable description');
  program.parse(['executable'], { from: 'user' });

  mockProcess.emit('error', makeSystemError('OTHER'));

  expect(exitSpy.called).toBe(true);

  spawnSpy.restore();
  exitSpy.restore();
});

it('when subcommand executable fails with other error then exit', () => {
  // The existing behaviour is to just silently fail for unexpected errors, as it is happening
  // asynchronously in spawned process and client can not catch errors.
  const mockProcess = new EventEmitter();
  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => { return mockProcess; });
  const exitSpy = sinon.stub(process, 'exit').callsFake(() => { });
  const program = new commander.Command();
  program.command('executable', 'executable description');
  program.parse(['executable'], { from: 'user' });
  mockProcess.emit('error', makeSystemError('OTHER'));
  expect(exitSpy.lastCall.args).toEqual([1]);
  exitSpy.restore();
  spawnSpy.restore();
});