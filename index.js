import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile, existsSync, mkdirSync } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, description, author, version } = require(join(__dirname, './package.json'));
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

function verify() {
  const dirs = ['tmp', 'Sesiones/Subbots', 'Sesiones/Principal'];
  for (const dir of dirs) {
    if (typeof dir === 'string' && dir.trim() !== '') {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    } else {
      console.warn('Ruta inválida o no definida:', dir);
    }
  }
}
verify();

say('The-MikuBot-MD', {
  font: 'chrome',
  align: 'center',
  colors: ['white']
});
say(`Developed By • AdrianOficial`, {
  font: 'console',
  align: 'center',
  colors: ['magenta']
});

let isRunning = false;
let child;

function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];
  child = spawn('node', args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

  child.on('message', data => {
    switch (data) {
      case 'reset':
        child.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        child.send(process.uptime());
        break;
    }
  });

  child.on('exit', (code) => {
    isRunning = false;
    console.error('🚩 Error :\n', code);
    process.exit();
  });

  const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  if (!opts['test']) {
    if (!rl.listenerCount('line')) {
      rl.on('line', line => {
        if (child && child.connected) {
          child.send(line.trim());
        }
      });
    }
  }

  watchFile(args[0], () => {
    unwatchFile(args[0]);
    if (child) child.kill();
    isRunning = false;
    start(file);
  });
}

process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    console.warn('🚩 Se excedió el límite de Listeners en :');
    console.warn(warning.stack);
  }
});

start('main.js');
