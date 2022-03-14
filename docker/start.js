const { spawn } = require('child_process')

process.env.NODE_CONFIG_DIR = '/app/config'

spawn('node', ['./dist/main.js'], {
  stdio: 'inherit',
  env: { NODE_ENV: 'production', ...process.env },
})
