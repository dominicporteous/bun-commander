import { it, describe, expect } from 'bun:test'
import childProcess from 'node:child_process';
import path from 'node:path';

const skip = () => {}

// Test that a signal sent to the parent process is received by the executable subcommand process (which is listening).

// Disabling tests on Windows as:
// "Windows does not support sending signals"
//  https://nodejs.org/api/process.html#process_signal_events
const describeOrSkipOnWindows = (process.platform === 'win32') ? skip : describe;

// Note: the previous (sinon) test had custom code for SIGUSR1, revisit if required:
//    As described at https://nodejs.org/api/process.html#process_signal_events
//    this signal will start a debugger and thus the process might output an
//    additional error message:
//      "Failed to open socket on port 5858, waiting 1000 ms before retrying".

// WIP: https://github.com/oven-sh/bun/issues/1505
for (const value of [['SIGINT'], ['SIGHUP'], ['SIGTERM'], ['SIGUSR1'], ['SIGUSR2']]) {
  describe('test signal handling in executableSubcommand', () => {
    // Slightly tricky test, stick with callback and disable lint warning.
    // eslint-disable-next-line jest/no-done-callback
    skip(`when command killed with ${value} then executableSubcommand receives ${value}`, (done) => {
      const pmPath = path.join(__dirname, './fixtures/pm');

      // The child process writes to stdout.
      const proc = childProcess.spawn(pmPath, ['listen'], {});

      let processOutput = '';
      proc.stdout.on('data', (data) => {
        if (processOutput.length === 0) {
          proc.kill(`${value}`);
        }
        processOutput += data.toString();
      });
      proc.on('close', (code) => {
        expect(processOutput).toBe(`Listening for signal...${value}`);
        done();
      });
    });
  });
}
