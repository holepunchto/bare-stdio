const test = require('brittle')
const { join } = require('bare-path')
const { spawn } = require('bare-subprocess')
const pty = require('tt-native')

const fixture = join(__dirname, 'fixtures', 'print', 'index.js')

test('should work with ignore', async (t) => {
  t.plan(1)

  const child = spawn('bare', [fixture], {
    stdio: ['ignore', 'ignore', 'ignore']
  })

  const exitCode = await new Promise((resolve) => {
    child.on('exit', resolve)
  })
  t.is(exitCode, 0, 'process should exit successfully')
})

test('should work on a tty', async (t) => {
  t.plan(2)

  const child = pty.spawn('bare', [fixture], { cols: 80, rows: 24 })
  let output = ''
  child.on('data', (data) => {
    output += data
  })

  const exitCode = await new Promise((resolve) => {
    child.on('exit', resolve)
  })
  t.is(exitCode, 0, 'process should exit successfully')
  t.is(output, 'stdoutstderr', 'process should print to stdout and stderr')
})

test('should work with pipe', async (t) => {
  t.plan(3)

  const child = spawn('bare', [fixture], {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  let stdout = ''
  child.stdout.on('data', (chunk) => (stdout += chunk.toString()))

  let stderr = ''
  child.stderr.on('data', (chunk) => (stderr += chunk.toString()))

  const exitCode = await new Promise((resolve) => {
    child.on('exit', resolve)
  })

  t.is(exitCode, 0, 'process should exit successfully')
  t.is(stdout, 'stdout', 'stdout should be piped')
  t.is(stderr, 'stderr', 'stderr should be piped')
})

test('should work with inherit', async (t) => {
  t.plan(1)

  const child = spawn('bare', [fixture], {
    stdio: ['inherit', 'inherit', 'inherit']
  })

  const exitCode = await new Promise((resolve) => {
    child.on('exit', resolve)
  })
  t.is(exitCode, 0, 'process should exit successfully')
})
