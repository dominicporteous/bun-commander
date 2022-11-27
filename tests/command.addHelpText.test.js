import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Using outputHelp to simplify testing.

describe('program calls to addHelpText', () => {
  let writeSpy;

  beforeAll(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  it('when "before" string then string before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('before', 'text');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, 'text\n');
    expect(writeSpy).toHaveBeenNthCalledWith(2, program.helpInformation());
  });

  it('when "before" function then function result before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('before', () => 'text');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, 'text\n');
    expect(writeSpy).toHaveBeenNthCalledWith(2, program.helpInformation());
  });

  it('when "before" function returns nothing then no effect', () => {
    const program = new commander.Command();
    program.addHelpText('before', () => { });
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, program.helpInformation());
  });

  it('when "beforeAll" string then string before built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('beforeAll', 'text');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, 'text\n');
    expect(writeSpy).toHaveBeenNthCalledWith(2, program.helpInformation());
  });

  it('when "after" string then string after built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('after', 'text');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, program.helpInformation());
    expect(writeSpy).toHaveBeenNthCalledWith(2, 'text\n');
  });

  it('when "afterAll" string then string after built-in help', () => {
    const program = new commander.Command();
    program.addHelpText('afterAll', 'text');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, program.helpInformation());
    expect(writeSpy).toHaveBeenNthCalledWith(2, 'text\n');
  });

  it('when all the simple positions then strings in order', () => {
    const program = new commander.Command();
    program.addHelpText('before', 'before');
    program.addHelpText('after', 'after');
    program.addHelpText('beforeAll', 'beforeAll');
    program.addHelpText('afterAll', 'afterAll');
    program.outputHelp();
    expect(writeSpy).toHaveBeenNthCalledWith(1, 'beforeAll\n');
    expect(writeSpy).toHaveBeenNthCalledWith(2, 'before\n');
    expect(writeSpy).toHaveBeenNthCalledWith(3, program.helpInformation());
    expect(writeSpy).toHaveBeenNthCalledWith(4, 'after\n');
    expect(writeSpy).toHaveBeenNthCalledWith(5, 'afterAll\n');
  });

  it('when "silly" position then throw', () => {
    const program = new commander.Command();
    expect(() => {
      program.addHelpText('silly', 'text');
    }).toThrow();
  });
});

describe('program and subcommand calls to addHelpText', () => {
  let writeSpy;

  beforeAll(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  it('when "before" on program then not called on subcommand', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = jest.fn();
    program.addHelpText('before', testMock);
    sub.outputHelp();
    expect(testMock).not.toHaveBeenCalled();
  });

  it('when "beforeAll" on program then is called on subcommand', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = jest.fn();
    program.addHelpText('beforeAll', testMock);
    sub.outputHelp();
    expect(testMock).toHaveBeenCalled();
  });

  it('when "after" on program then not called on subcommand', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = jest.fn();
    program.addHelpText('after', testMock);
    sub.outputHelp();
    expect(testMock).not.toHaveBeenCalled();
  });

  it('when "afterAll" on program then is called on subcommand', () => {
    const program = new commander.Command();
    const sub = program.command('sub');
    const testMock = jest.fn();
    program.addHelpText('afterAll', testMock);
    sub.outputHelp();
    expect(testMock).toHaveBeenCalled();
  });
});

describe('context checks with full parse', () => {
  let stdoutSpy;
  let stderrSpy;

  beforeAll(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    stdoutSpy.mockClear();
    stderrSpy.mockClear();
  });

  afterAll(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('when help requested then text is on stdout', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', 'text');
    expect(() => {
      program.parse(['--help'], { from: 'user' });
    }).toThrow();
    expect(stdoutSpy).toHaveBeenCalledWith('text\n');
  });

  it('when help for error then text is on stderr', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', 'text')
      .command('sub');
    expect(() => {
      program.parse([], { from: 'user' });
    }).toThrow();
    expect(stderrSpy).toHaveBeenCalledWith('text\n');
  });

  it('when help requested then context.error is false', () => {
    let context = {};
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', (contextParam) => { context = contextParam; });
    expect(() => {
      program.parse(['--help'], { from: 'user' });
    }).toThrow();
    expect(context.error).toBe(false);
  });

  it('when help for error then context.error is true', () => {
    let context = {};
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', (contextParam) => { context = contextParam; })
      .command('sub');
    expect(() => {
      program.parse([], { from: 'user' });
    }).toThrow();
    expect(context.error).toBe(true);
  });

  it('when help on program then context.command is program', () => {
    let context = {};
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('before', (contextParam) => { context = contextParam; });
    expect(() => {
      program.parse(['--help'], { from: 'user' });
    }).toThrow();
    expect(context.command).toBe(program);
  });

  it('when help on subcommand and "before" subcommand then context.command is subcommand', () => {
    let context = {};
    const program = new commander.Command();
    program
      .exitOverride();
    const sub = program.command('sub')
      .addHelpText('before', (contextParam) => { context = contextParam; });
    expect(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    }).toThrow();
    expect(context.command).toBe(sub);
  });

  it('when help on subcommand and "beforeAll" on program then context.command is subcommand', () => {
    let context = {};
    const program = new commander.Command();
    program
      .exitOverride()
      .addHelpText('beforeAll', (contextParam) => { context = contextParam; });
    const sub = program.command('sub');
    expect(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    }).toThrow();
    expect(context.command).toBe(sub);
  });
});
