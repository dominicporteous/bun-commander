import { beforeEach, describe, expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

const skip = () => {}

// treating optional same as required, treat as option taking value rather than as boolean
for(const fooFlags of ['-f, --foo <required-arg>', '-f, --foo [optional-arg]']){
  describe(`option declared as: ${fooFlags}`, () => {
    it('when env undefined and no cli then option undefined', () => {
      const program = new commander.Command();
      program.addOption(new commander.Option(fooFlags).env('BAR'));
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe(undefined);
    });

    it('when env defined and no cli then option from env', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR'));
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe('env');
      delete process.env.BAR;
    });

    it('when env defined and cli then option from cli', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR'));
      program.parse(['--foo', 'cli'], { from: 'user' });
      expect(program.opts().foo).toBe('cli');
      delete process.env.BAR;
    });

    it('when env defined and value source is config then option from env', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR'));
      program.setOptionValueWithSource('foo', 'config', 'config');
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe('env');
      delete process.env.BAR;
    });

    it('when env defined and value source is unspecified then option unchanged', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR'));
      program.setOptionValue('foo', 'client');
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe('client');
      delete process.env.BAR;
    });

    it('when default and env undefined and no cli then option from default', () => {
      const program = new commander.Command();
      program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe('default');
    });

    it('when default and env defined and no cli then option from env', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
      program.parse([], { from: 'user' });
      expect(program.opts().foo).toBe('env');
      delete process.env.BAR;
    });

    it('when default and env defined and cli then option from cli', () => {
      const program = new commander.Command();
      process.env.BAR = 'env';
      program.addOption(new commander.Option(fooFlags).env('BAR').default('default'));
      program.parse(['--foo', 'cli'], { from: 'user' });
      expect(program.opts().foo).toBe('cli');
      delete process.env.BAR;
    });
  });
}

describe('boolean flag', () => {
  it('when env undefined and no cli then option undefined', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(undefined);
  });

  it('when env defined with value and no cli then option true', () => {
    const program = new commander.Command();
    process.env.BAR = '';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  it('when env is "" and no cli then option true', () => {
    // any string, including ""
    const program = new commander.Command();
    process.env.BAR = '';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  it('when env is "0" and no cli then option true', () => {
    // any string, including "0"
    const program = new commander.Command();
    process.env.BAR = '0';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  it('when env is "false" and no cli then option true', () => {
    // any string, including "false"
    const program = new commander.Command();
    process.env.BAR = 'false';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });
});

describe('boolean no-flag', () => {
  it('when env undefined and no cli then option true', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
  });

  it('when env defined and no cli then option false', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program.addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.NO_BAR;
  });
});

describe('boolean flag and negatable', () => {
  beforeEach(() => {
    process.env.BAR = undefined;
    process.env.NO_BAR = undefined;
  })
  it('when env undefined and no cli then option undefined', () => {
    const program = new commander.Command();
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBeUndefined();
  });

  it('when env defined and no cli then option true', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.BAR;
  });

  it('when env defined and cli --no-foo then option false', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse(['--no-foo'], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.BAR;
  });

  it('when no_env defined and no cli then option false', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe(false);
    delete process.env.NO_BAR;
  });

  it('when no_env defined and cli --foo then option true', () => {
    const program = new commander.Command();
    process.env.NO_BAR = 'env';
    program
      .addOption(new commander.Option('-f, --foo').env('BAR'))
      .addOption(new commander.Option('-F, --no-foo').env('NO_BAR'));
    program.parse(['--foo'], { from: 'user' });
    expect(program.opts().foo).toBe(true);
    delete process.env.NO_BAR;
  });
});

describe('custom argParser', () => {
  it('when env defined and no cli then custom parse from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR').argParser(str => str.toUpperCase()));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toBe('ENV');
    delete process.env.BAR;
  });
});

describe('variadic', () => {
  it('when env defined and no cli then array from env', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(program.opts().foo).toEqual(['env']);
    delete process.env.BAR;
  });

  it('when env defined and cli then array from cli', () => {
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(program.opts().foo).toEqual(['cli']);
    delete process.env.BAR;
  });
});

describe('env only processed when applies', () => {
  it('when env defined on another subcommand then env not applied', () => {
    // Doing selective processing. Not processing env at addOption time.
    const program = new commander.Command();
    process.env.BAR = 'env';
    program.command('one')
      .action(() => {});
    const two = program.command('two')
      .addOption(new commander.Option('-f, --foo <required...>').env('BAR').default('default'))
      .action(() => {});
    program.parse(['one'], { from: 'user' });
    expect(two.opts().foo).toBe('default');
    delete process.env.BAR;
  });

  it('when env and cli defined then only emit option event for cli', () => {
    const program = new commander.Command();
    const optionEventMock = sinon.spy();
    const optionEnvEventMock = sinon.spy();
    program.on('option:foo', optionEventMock);
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR'));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(optionEventMock.lastCall.args).toEqual(['cli']);
    expect(optionEventMock.calledOnce).toBe(true);
    expect(optionEnvEventMock.called).toBe(false);
    delete process.env.BAR;
  });

  it('when env and cli defined then only parse value for cli', () => {
    const program = new commander.Command();
    const parseMock = sinon.spy();
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required...>').env('BAR').argParser(parseMock));
    program.parse(['--foo', 'cli'], { from: 'user' });
    expect(parseMock.lastCall.args).toEqual(['cli', undefined]);
    expect(parseMock.calledOnce).toBe(true);
    delete process.env.BAR;
  });
});

describe('events dispatched for env', () => {
  const optionEnvEventMock = sinon.spy();

  afterEach(() => {
    optionEnvEventMock.resetHistory();
    delete process.env.BAR;
  });

  it('when env defined then emit "optionEnv" and not "option"', () => {
    // Decided to do separate events, so test stays that way.
    const program = new commander.Command();
    const optionEventMock = sinon.spy();
    program.on('option:foo', optionEventMock);
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEventMock.called).toBe(false);
    expect(optionEnvEventMock.called).toBe(true);
  });

  it('when env defined for required then emit "optionEnv" with value', () => {
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo <required>').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock.lastCall.args).toEqual(['env']);
  });

  it('when env defined for optional then emit "optionEnv" with value', () => {
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'env';
    program.addOption(new commander.Option('-f, --foo [optional]').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock.lastCall.args).toEqual(['env']);
  });

  it('when env defined for boolean then emit "optionEnv" with no param', () => {
    // check matches historical boolean action event
    const program = new commander.Command();
    program.on('optionEnv:foo', optionEnvEventMock);
    process.env.BAR = 'anything';
    program.addOption(new commander.Option('-f, --foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock.lastCall.args).toEqual([]);
  });

  it('when env defined for negated boolean then emit "optionEnv" with no param', () => {
    // check matches historical boolean action event
    const program = new commander.Command();
    program.on('optionEnv:no-foo', optionEnvEventMock);
    process.env.BAR = 'anything';
    program.addOption(new commander.Option('-F, --no-foo').env('BAR'));
    program.parse([], { from: 'user' });
    expect(optionEnvEventMock.lastCall.args).toEqual([]);
  });
});
