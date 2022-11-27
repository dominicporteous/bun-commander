import { describe, expect, it } from "bun:test";
import commander from '../index.js';

it('when override createCommand then affects help', () => {
  class MyHelp extends commander.Help {
    formatHelp(cmd, helper) {
      return 'custom';
    }
  }

  class MyCommand extends commander.Command {
    createHelp() {
      return Object.assign(new MyHelp(), this.configureHelp());
    }
  }

  const program = new MyCommand();
  expect(program.helpInformation()).toEqual('custom');
});
