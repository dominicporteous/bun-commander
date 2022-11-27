import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { throws } from 'node:assert'
import sinon from 'sinon'
import { silentCommand } from './util/silent.js'

// Test .version. Using exitOverride to check behaviour (instead of mocking process.exit).

describe('.version', () => {
  it('when no .version and specify --version then unknown option error', () => {
    const errorMessage = 'unknownOption';
    const program = silentCommand();
    // Override unknownOption as convenient way to check fails as expected.
    const stub = sinon.stub(program, 'unknownOption').throws(new Error(errorMessage))
    throws(() => program.parse(['node', 'test', '--version']),  (err) => err.message.includes(errorMessage))
  });

  it('when no .version then helpInformation does not include version', () => {
    const program = silentCommand();
    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('Usage')).toBe(true);
    expect(helpInformation.includes('version')).toBe(false);
  });

  it('when specify default short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy()
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);
    
    try {
      program.parse(['node', 'test', '--version']);
    } catch (err) {
      expect(err.message).toContain(myVersion)
    }
    expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when specify default long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion);

    try {
      program.parse(['node', 'test', '--version']);
    } catch (err) {
      expect(err.message).toContain(myVersion)
    }

    expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when default .version then helpInformation includes default version help', () => {
    const myVersion = '1.2.3';
    const program = silentCommand();
    program
      .version(myVersion);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes('-V, --version')).toBe(true);
    expect(helpInformation.includes('output the version number')).toBe(true);
  });

  it('when specify custom short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

      try {
        program.parse(['node', 'test', '-r']);
      } catch (err) {
        expect(err.message).toContain(myVersion)
      }
  
      expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when specify just custom short flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r');

    try {
      program.parse(['node', 'test', '-r']);
    } catch (err) {
      expect(err.message).toContain(myVersion)
    }

    expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when specify custom long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '-r, --revision');

    try {
      program.parse(['node', 'test', '--revision']);
    } catch (err) {
      expect(err.message).toContain(myVersion)
    }

    expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when specify just custom long flag then display version', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion, '--revision');

    try {
      program.parse(['node', 'test', '--revision']);
    } catch (err) {
      expect(err.message).toContain(myVersion)
    }

    expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when custom .version then helpInformation includes custom version help', () => {
    const myVersion = '1.2.3';
    const myVersionFlags = '-r, --revision';
    const myVersionDescription = 'custom description';
    const program = silentCommand();
    program
      .version(myVersion, myVersionFlags, myVersionDescription);

    const helpInformation = program.helpInformation();

    expect(helpInformation.includes(myVersionFlags)).toBe(true);
    expect(helpInformation.includes(myVersionDescription)).toBe(true);
  });

  it('when have .version+version and specify version then command called', () => {
    const actionMock = sinon.spy();
    const program = silentCommand();
    program
      .version('1.2.3')
      .command('version')
      .action(actionMock);

    program.parse(['node', 'test', 'version']);

    expect(actionMock.called).toBe(true)
  });

  it('when have .version+version and specify --version then version displayed', () => {
    const myVersion = '1.2.3';
    const writeMock = sinon.spy();
    const program = silentCommand();
    program
      .exitOverride()
      .configureOutput({ writeOut: writeMock })
      .version(myVersion)
      .command('version')
      .action(() => {});

      try {
        program.parse(['node', 'test', '--version']);
      } catch (err) { }
  
      expect(writeMock.calledWith(`${myVersion}\n`)).toBe(true)
  });

  it('when specify version then can get version', () => {
    const myVersion = '1.2.3';
    const program = silentCommand();
    program.version(myVersion);
    expect(program.version()).toEqual(myVersion);
  });
});