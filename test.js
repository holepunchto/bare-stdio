const test = require('brittle')
const path = require('bare-path')
const { spawn } = require('bare-subprocess')
const os = require('bare-os')
const pty = require('tt-native')

const execPath = os.execPath()

const fixtures = path.join(__dirname, 'test', 'fixtures')

test('should work with ignore', async (t) => {
  t.plan(1)

  const child = spawn(execPath, [path.join(fixtures, 'print')], {
    stdio: 'ignore'
  })

  child.on('exit', (exitCode) => {
    t.is(exitCode, 0)
  })
})

test('should work with pipe', async (t) => {
  t.plan(3)

  const child = spawn(execPath, [path.join(fixtures, 'print')], {
    stdio: 'pipe'
  })

  const stdout = []
  child.stdout.on('data', (data) => stdout.push(data))

  const stderr = []
  child.stderr.on('data', (data) => stderr.push(data))

  child.on('exit', (exitCode) => {
    t.is(exitCode, 0)
    t.is(Buffer.concat(stdout).toString(), 'stdout')
    t.is(Buffer.concat(stderr).toString(), 'stderr')
  })
})

test('should work with inherit', async (t) => {
  t.plan(1)

  const child = spawn(execPath, [path.join(fixtures, 'print')], {
    stdio: 'inherit'
  })

  child.on('exit', (exitCode) => {
    t.is(exitCode, 0, 'process should exit successfully')
  })
})

test('should work on a tty', { skip: os.platform() === 'win32' }, async (t) => {
  t.plan(2)

  const child = pty.spawn(execPath, [path.join(fixtures, 'print')], { cols: 80, rows: 24 })

  const output = []

  child
    .on('data', (data) => output.push(data))
    .on('exit', (exitCode) => {
      t.is(exitCode, 0)
      t.is(Buffer.concat(output).toString(), 'stdoutstderr')
    })
})
