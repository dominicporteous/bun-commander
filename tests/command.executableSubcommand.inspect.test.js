// Bun: node inspect not supported

/* import { expect, it } from "bun:test";
import childProcess from 'node:child_process';
import path from 'node:path';
import util from 'node:util';

const execFileAsync = util.promisify(childProcess.execFile);

// Test the special handling for --inspect to increment fixed debug port numbers.
// If we reuse port we can get conflicts because port not released fast enough.

const inspectCommand = path.join(__dirname, './fixtures', 'inspect.js');

it('when execArgv empty then spawn execArgs empty', async() => {
  const { stdout } = await execFileAsync('bun', [inspectCommand, 'sub']);
  expect(stdout).toBe('[]\n');
});

it('when execArgv --harmony then spawn execArgs --harmony', async() => {
  const { stdout } = await execFileAsync('bun', ['--harmony', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--harmony' ]\n");
});

// --inspect defaults to 127.0.0.1:9229, port should be incremented
it('when execArgv --inspect then spawn execArgs using port 9230', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9230' ]\n");
});

// custom port
it('when execArgv --inspect=9240 then spawn execArgs using port 9241', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect=9240', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9241' ]\n");
});

// zero is special, random port
it('when execArgv --inspect=0 then spawn execArgs --inspect=0', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect=0', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=0' ]\n");
});

// ip address
it('when execArgv --inspect=127.0.0.1:9250 then spawn execArgs --inspect=127.0.0.1:9251', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect=127.0.0.1:9250', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9251' ]\n");
});

// localhost
it('when execArgv --inspect=localhost:9260 then spawn execArgs --inspect=localhost:9261', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect=localhost:9260', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=localhost:9261' ]\n");
});

// --inspect-port, just test most likely format
it('when execArgv --inspect-port=9270 then spawn execArgs --inspect-port=127.0.0.1:9271', async() => {
  const { stdout } = await execFileAsync('bun', ['--inspect-port=9270', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect-port=127.0.0.1:9271' ]\n");
});*/