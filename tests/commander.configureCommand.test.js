import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert'
import commander from '../index.js';
import sinon from 'sinon'

// Mostly testing direct on program, limited check that (sub)command working same.

// Default behaviours

it('when default then options not stored on command', () => {
  const program = new commander.Command();
  program
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe(undefined);
  expect(program.opts().foo).toBe('bar');
});

it('when default then options+command passed to action', () => {
  const program = new commander.Command();
  const callback = sinon.spy();
  program
    .argument('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback.getCall(0).args).toEqual(['value', program.opts(), program]);
});

// storeOptionsAsProperties

it('when storeOptionsAsProperties() then options stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties()
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
  expect(program.opts().foo).toBe('bar');
});

it('when storeOptionsAsProperties(true) then options stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(true)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe('bar');
  expect(program.opts().foo).toBe('bar');
});

it('when storeOptionsAsProperties(false) then options not stored on command', () => {
  const program = new commander.Command();
  program
    .storeOptionsAsProperties(false)
    .option('--foo <value>', 'description');
  program.parse(['node', 'test', '--foo', 'bar']);
  expect(program.foo).toBe(undefined);
  expect(program.opts().foo).toBe('bar');
});

it('when storeOptionsAsProperties() then command+command passed to action', () => {
  const program = new commander.Command();
  const callback = sinon.spy();
  program
    .storeOptionsAsProperties()
    .argument('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback.getCall(0).args).toEqual(['value', program, program]);
});

it('when storeOptionsAsProperties(false) then opts+command passed to action', () => {
  const program = new commander.Command();
  const callback = sinon.spy();
  program
    .storeOptionsAsProperties(false)
    .argument('<value>')
    .action(callback);
  program.parse(['node', 'test', 'value']);
  expect(callback.getCall(0).args).toEqual(['value', program.opts(), program]);
});

it('when storeOptionsAsProperties() after adding option then throw', () => {
  const program = new commander.Command();
  program.option('--port <number>', 'port number', '80');
  throws(() => {
    program.storeOptionsAsProperties(false);
  })
});
