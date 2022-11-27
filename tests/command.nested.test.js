import { expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

it('when call nested subcommand then runs', () => {
  const program = new commander.Command();
  const leafAction = sinon.spy();
  program
    .command('sub1')
    .command('sub2')
    .action(leafAction);
  program.parse('node test.js sub1 sub2'.split(' '));
  expect(leafAction.called).toBe(true);
});
