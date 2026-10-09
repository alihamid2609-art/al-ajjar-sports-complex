const { spawn } = require('child_process');
const path = require('path');

const npmCli = path.join(process.env.ProgramFiles || 'C:\\Program Files', 'nodejs', 'node_modules', 'npm', 'bin', 'npm-cli.js');
const node = process.execPath;

const build = spawn(node, [npmCli, 'run', 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: false
});

build.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code || 1);
  }

  require('./server');
});
