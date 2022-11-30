import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Do some low-level checks that the multiple ways of specifying command arguments produce same internal result,
// and not exhaustively testing all methods elsewhere.

for (const [methodName, cmd] of getSingleArgCases('<explicit-required>')){
  it(`when add "<arg>" using ${methodName} then argument required`, () => {
    const argument = cmd._args[0];
    
    expect(argument._name).toEqual('explicit-required');
    expect(argument.required).toEqual(true);
    expect(argument.variadic).toEqual(false);
    expect(argument.description).toEqual('');
  });
}

for (const [methodName, cmd] of getSingleArgCases('implicit-required')){
  it(`when add "arg" using ${methodName} then argument required`, () => {
    const argument = cmd._args[0];

    expect(argument._name).toEqual('implicit-required');
    expect(argument.required).toEqual(true);
    expect(argument.variadic).toEqual(false);
    expect(argument.description).toEqual('');

  });
}

for (const [methodName, cmd] of getSingleArgCases('[optional]')){
  it(`when add "[arg]" using ${methodName} then argument optional`, () => {
    const argument = cmd._args[0];
    
    expect(argument._name).toEqual('optional');
    expect(argument.required).toEqual(false);
    expect(argument.variadic).toEqual(false);
    expect(argument.description).toEqual('');
  });
}


for (const [methodName, cmd] of getSingleArgCases('<explicit-required...>')){
  it(`when add "<arg...>" using ${methodName} then argument required and variadic`, () => {
    const argument = cmd._args[0];
    expect(argument._name).toEqual('explicit-required');
    expect(argument.required).toEqual(true);
    expect(argument.variadic).toEqual(true);
    expect(argument.description).toEqual('');
  });
}

for (const [methodName, cmd] of getSingleArgCases('implicit-required...')){
  it(`when add "arg..." using ${methodName} then argument required and variadic`, () => {
    const argument = cmd._args[0];
    expect(argument._name).toEqual('implicit-required');
    expect(argument.required).toEqual(true);
    expect(argument.variadic).toEqual(true);
    expect(argument.description).toEqual('');
  });
}

for (const [methodName, cmd] of getSingleArgCases('[optional...]')){
  it(`when add "[arg...]" using ${methodName} then argument optional and variadic`, () => {
    const argument = cmd._args[0];
    expect(argument._name).toEqual('optional');
    expect(argument.required).toEqual(false);
    expect(argument.variadic).toEqual(true);
    expect(argument.description).toEqual('');
  });
}

function getSingleArgCases(arg) {
  return [
    ['.arguments', new commander.Command().arguments(arg)],
    ['.argument', new commander.Command().argument(arg)],
    ['.addArgument', new commander.Command('add-argument').addArgument(new commander.Argument(arg))],
    ['.command', new commander.Command().command(`command ${arg}`)]
  ];
}


for (const [methodName, cmd] of getMultipleArgCases('<first>', '[second]')){
  it(`when add two arguments using ${methodName} then two arguments`, () => {
    expect(cmd._args[0].name()).toEqual('first');
    expect(cmd._args[1].name()).toEqual('second');
  });
}

function getMultipleArgCases(arg1, arg2) {
  return [
    ['.arguments', new commander.Command().arguments(`${arg1} ${arg2}`)],
    ['.argument', new commander.Command().argument(arg1).argument(arg2)],
    ['.addArgument', new commander.Command('add-argument').addArgument(new commander.Argument(arg1)).addArgument(new commander.Argument(arg2))],
    ['.command', new commander.Command().command(`command ${arg1} ${arg2}`)]
  ];
}

it('when add arguments using multiple methods then all added', () => {
  // This is not a key use case, but explicitly test that additive behaviour.
  const program = new commander.Command();
  const cmd = program.command('sub <arg1> <arg2>');
  cmd.arguments('<arg3> <arg4>');
  cmd.argument('<arg5>');
  cmd.addArgument(new commander.Argument('arg6'));
  const argNames = cmd._args.map(arg => arg.name());
  expect(argNames).toEqual(['arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6']);
});
