import { describe, beforeEach, afterEach, expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

// Testing various help incantations.
//
// Note there are also specific help tests included in many of the feature tests,
// such as the alias, version, usage, name, helpOption, and commandHelp tests.

describe('testing various help incantations', () => {

  const sandbox = sinon.createSandbox();
  
  const programWithOutputSpy = () => {
    const program = new commander.Command();
    sandbox.spy(program._outputConfiguration);
    return program
  }

  beforeEach(() => {
    sandbox.spy(Bun.write);
  });

  afterEach(() => {
    sandbox.resetHistory();
  });

  // Avoid doing many full format tests as will be broken by any layout changes!
  it('when call helpInformation for program then help format is as expected (usage, options, commands)', () => {
    const program = programWithOutputSpy()
    program
      .command('my-command <file>');
    const expectedHelpInformation =
  `Usage: test [options] [command]

Options:
  -h, --help         display help for command

Commands:
  my-command <file>
  help [command]     display help for command
  `;

    program.name('test');
    const helpInformation = program.helpInformation();
    expect(helpInformation.trim()).toEqual(expectedHelpInformation.trim());
  });

  it('when use .description for command then help includes description', () => {
    const program = programWithOutputSpy()
    program
      .command('simple-command')
      .description('custom-description');
    program._help = 'test';
    const helpInformation = program.helpInformation();
    expect(helpInformation.indexOf('simple-command  custom-description')).toEqual(94);
  });

  it('when call .help then exit', () => {
    // Optional. Suppress normal output to keep test output clean.
    const program = programWithOutputSpy()
    program
      .exitOverride();
    try {
      program.help();
    } catch (err) {
      expect(err.message).toEqual('(outputHelp)')
    }
  });

  it('when specify --help then exit', () => {
    // Optional. Suppress normal output to keep test output clean.
    const program = programWithOutputSpy()
    program
      .exitOverride();
      try {
        program.help();
      } catch (err) {
        expect(err.message).toEqual('(outputHelp)')
      }
  });

  it('when call help(cb) then display cb output and exit', () => {
    // Using spy to detect custom output
    const helpReplacement = 'reformatted help';
    const program = programWithOutputSpy()
    program
      .exitOverride();
      try {
        program.help((helpInformation) => {
          return helpReplacement;
        });
      } catch (err) {
        expect(err.message).toEqual('(outputHelp)')
      }
    expect(program._outputConfiguration.writeOut.calledOnce).toBe(true)
    expect(program._outputConfiguration.writeOut.getCall(0).args[0]).toBe(helpReplacement);
  });

  it('when call outputHelp(cb) then display cb output', () => {
    // Using spy to detect custom output
    const helpReplacement = 'reformatted help';
    const program = programWithOutputSpy()
    program.outputHelp((helpInformation) => {
      return helpReplacement;
    });
    expect(program._outputConfiguration.writeOut.calledOnce).toBe(true)
    expect(program._outputConfiguration.writeOut.getCall(0).args[0]).toBe(helpReplacement);
  });

  it('when call deprecated outputHelp(cb) with wrong callback return type then throw', () => {
    const program = programWithOutputSpy()
    try {
      program.outputHelp((helpInformation) => 3);
    } catch (err) {
      expect(err.message).toContain('must return a string or a Buffer')
    }
  });

  it('when command sets deprecated noHelp then not displayed in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .command('secret', 'secret description', { noHelp: true });
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('secret');
  });

  it('when command sets hidden then not displayed in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .command('secret', 'secret description', { hidden: true });
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('secret');
  });

  it('when addCommand with hidden:true then not displayed in helpInformation', () => {
    const program = programWithOutputSpy()
    const secretCmd = new commander.Command('secret');
    program
      .addCommand(secretCmd, { hidden: true });
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('secret');
  });

  it('when help short flag masked then not displayed in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .option('-h, --host', 'select host');
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('-h, --help');
  });

  it('when both help flags masked then not displayed in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .option('-h, --help', 'custom');
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('display help');
  });

  it('when call .help then output on stdout', () => {
    const program = programWithOutputSpy()
    program
      .exitOverride();
    try {
      program.help();
    } catch (err) {
      expect(err.message).toEqual('(outputHelp)')
    }
    expect(program._outputConfiguration.writeOut.calledOnce).toBe(true)
  });

  it('when call .help with { error: true } then output on stderr', () => {
    const program = programWithOutputSpy()
    program
      .exitOverride();
      try {
        program.help({ error: true });
      } catch (err) {
        expect(err.message).toEqual('(outputHelp)')
      }
    expect(program._outputConfiguration.writeErr.calledOnce).toBe(true)
  });

  it('when no options then Options not included in helpInformation', () => {
    const program = programWithOutputSpy()
    // No custom options, no version option, no help option
    program
      .helpOption(false);
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('Options');
  });

  it('when negated option then option included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .option('-C, --no-colour', 'colourless');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('--no-colour');
    expect(helpInformation).toContain('colourless');
  });

  it('when option.hideHelp() then option not included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-s,--secret', 'secret option').hideHelp());
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('secret');
  });

  it('when option.hideHelp(true) then option not included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-s,--secret', 'secret option').hideHelp(true));
    const helpInformation = program.helpInformation();
    expect(helpInformation).not.toContain('secret');
  });

  it('when option.hideHelp(false) then option included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-s,--secret', 'secret option').hideHelp(false));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('secret');
  });

  it('when option has default value then default included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .option('-p, --port <portNumber>', 'port number', 80);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(default: 80)');
  });

  it('when option has default value description then default description included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-a, --address <dotted>', 'ip address').default('127.0.0.1', 'home'));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(default: home)');
  });

  it('when option has choices then choices included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-c, --colour <colour>').choices(['red', 'blue']));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(choices: "red", "blue")');
  });

  it('when option has choices and default then both included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addOption(new commander.Option('-c, --colour <colour>').choices(['red', 'blue']).default('red'));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(choices: "red", "blue", default: "red")');
  });

  it('when argument then included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .name('foo')
      .argument('<file>');
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('Usage: foo [options] <file>');
  });

  it('when argument described then included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .argument('<file>', 'input source')
      .helpOption(false);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('Arguments');
    expect(helpInformation).toContain('file');
    expect(helpInformation).toContain('input');
    expect(helpInformation).toContain('source');
  });

  it('when argument described with default then included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .argument('[file]', 'input source', 'test.txt')
      .helpOption(false);
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain(
      'Arguments:\n  file  input source (default: \"test.txt\")'
    );
  });

  it('when arguments described in deprecated way then included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .arguments('<file>')
      .helpOption(false)
      .description('description', { file: 'input source' });
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain(
      'Arguments:\n  file  input source'
    );
  });

  it('when arguments described in deprecated way and empty description then arguments still included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .arguments('<file>')
      .helpOption(false)
      .description('', { file: 'input source' });
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain(
      'Arguments:\n  file  input source'
    );
  });

  it('when argument has choices then choices included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addArgument(new commander.Argument('<colour>', 'preferred colour').choices(['red', 'blue']));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(choices: "red", "blue")');
  });

  it('when argument has choices and default then both included in helpInformation', () => {
    const program = programWithOutputSpy()
    program
      .addArgument(new commander.Argument('<colour>', 'preferred colour').choices(['red', 'blue']).default('red'));
    const helpInformation = program.helpInformation();
    expect(helpInformation).toContain('(choices: "red", "blue", default: "red")');
  });

});