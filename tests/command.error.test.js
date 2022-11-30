import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert';
import commander from '../index.js';
import sinon from 'sinon'

it('when error called with message then message displayed on stderr', () => {
  const exitSpy = sinon.stub(process, 'exit').callsFake(() => { });
  const stderrSpy = sinon.stub(Bun, 'write').callsFake(() => { });

  const program = new commander.Command();
  const message = 'Goodbye';
  program.error(message);

  expect(stderrSpy.lastCall.args).toEqual([Bun.stderr, `${message}\n`]);

  stderrSpy.restore();
  exitSpy.restore();
});

it('when error called with no exitCode then process.exit(1)', () => {
  const exitSpy = sinon.stub(process, 'exit').callsFake(() => { });

  const program = new commander.Command();
  program.configureOutput({
    writeErr: () => {}
  });

  program.error('Goodbye');

  expect(exitSpy.lastCall.args).toEqual([1]);
  exitSpy.restore();
});

it('when error called with exitCode 2 then process.exit(2)', () => {
  const exitSpy = sinon.stub(process, 'exit').callsFake(() => { });

  const program = new commander.Command();
  program.configureOutput({
    writeErr: () => {}
  });
  program.error('Goodbye', { exitCode: 2 });

  expect(exitSpy.lastCall.args).toEqual([2]);
  exitSpy.restore();
});

it('when error called with code and exitOverride then throws with code', () => {
  const program = new commander.Command();
  let errorThrown;
  program
    .exitOverride((err) => { errorThrown = err; throw err; })
    .configureOutput({
      writeErr: () => {}
    });

  const code = 'commander.test';
  throws(() => {
    program.error('Goodbye', { code });
  });
  expect(errorThrown.code).toEqual(code);
});