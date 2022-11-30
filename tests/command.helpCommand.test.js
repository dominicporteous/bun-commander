import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert'; 
import commander from '../index.js';
import sinon from 'sinon'

describe('help command listed in helpInformation', () => {
  it('when program has no subcommands then no automatic help command', () => {
    const program = new commander.Command();
    const helpInformation = program.helpInformation();
    expect(new RegExp(/help \[command\]/).test(helpInformation)).toBe(false);
  });

  it('when program has no subcommands and add help command then has help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(true);
    const helpInformation = program.helpInformation();
    expect(new RegExp(/help \[command\]/).test(helpInformation)).toBe(true);
  });

  it('when program has subcommands then has automatic help command', () => {
    const program = new commander.Command();
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(new RegExp(/help \[command\]/).test(helpInformation)).toBe(true);
  });

  it('when program has subcommands and specify only unknown option then display help', () => {
    const program = new commander.Command();
    program
      .configureHelp({ formatHelp: () => '' })
      .exitOverride()
      .allowUnknownOption()
      .command('foo');
    let caughtErr;
    try {
      program.parse(['--unknown'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toEqual('commander.help');
  });

  it('when program has subcommands and suppress help command then no help command', () => {
    const program = new commander.Command();
    program.addHelpCommand(false);
    program.command('foo');
    const helpInformation = program.helpInformation();
    expect(new RegExp(/help \[command\]/).test(helpInformation)).toBe(false);
  });

  it('when add custom help command then custom help command', () => {
    const program = new commander.Command();
    program.addHelpCommand('myHelp', 'help description');
    const helpInformation = program.helpInformation();
    expect(new RegExp(/myHelp +help description/).test(helpInformation)).toBe(true);
  });
});

describe('help command processed on correct command', () => {
  // Use internal knowledge to suppress output to keep test output clean.
  //let writeErrorSpy;
  let writeSpy;

  beforeAll(() => {
    //writeErrorSpy = sinon.stub(Bun, 'write').callsFake(() => { });
    writeSpy = sinon.stub(process.stdout, 'write').callsFake(() => { });
  });

  afterEach(() => {
    //writeErrorSpy.restore();
    writeSpy.restore();
  });

  afterAll(() => {
    //writeErrorSpy.restore();
    writeSpy.restore();
  });

  it('when "program help" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1');
    program.exitOverride(() => { throw new Error('program'); });
    throws(() => {
      program.parse('node test.js help'.split(' '));
    }, { message: 'program' });
  });

  it('when "program help unknown" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1');
    program.exitOverride(() => { throw new Error('program'); });
    throws(() => {
      program.parse('node test.js help unknown'.split(' '));
    }, { message: 'program' });
  });

  it('when "program help sub1" then sub1', () => {
    const program = new commander.Command();
    program.exitOverride();
    const sub1 = program.command('sub1');
    sub1.exitOverride(() => { throw new Error('sub1'); });
    throws(() => {
      program.parse('node test.js help sub1'.split(' '));
    }, { message: 'sub1' });
  });

  it('when "program sub1 help sub2" then sub2', () => {
    const program = new commander.Command();
    program.exitOverride();
    const sub1 = program.command('sub1');
    const sub2 = sub1.command('sub2');
    sub2.exitOverride(() => { throw new Error('sub2'); });
    throws(() => {
      program.parse('node test.js sub1 help sub2'.split(' '));
    }, { message: 'sub2' });
  });

  it('when default command and "program help" then program', () => {
    const program = new commander.Command();
    program.exitOverride();
    program.command('sub1', { isDefault: true });
    program.exitOverride(() => { throw new Error('program'); });
    throws(() => {
      program.parse('node test.js help'.split(' '));
    }, { message: 'program' });
  });
});
