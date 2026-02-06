const tty = require('bare-tty')
const { Writable, Readable } = require('bare-stream')
const fs = require('bare-fs')

module.exports = new (class Stdio {
  drained = Writable.drained
  constructor() {
    this._in = null
    this._out = null
    this._err = null
    this.rawMode = false
  }

  get inAttached() {
    return this._in !== null
  }

  get in() {
    if (this._in === null) {
      this._in = tty.isTTY(0) ? new tty.ReadStream(0) : fs.createReadStream(null, { fd: 0 })
      this._in.once('close', () => {
        this._in = null
      })
    }
    return this._in
  }

  get out() {
    if (this._out === null) {
      this._out = tty.isTTY(1) ? new tty.WriteStream(1) : fs.createWriteStream(null, { fd: 1 })
    }
    return this._out
  }

  get err() {
    if (this._err === null) {
      this._err = tty.isTTY(2) ? new tty.WriteStream(2) : fs.createWriteStream(null, { fd: 2 })
    }
    return this._err
  }

  size() {
    if (!this.out.getWindowSize) return [80, 80]
    const [width, height] = this.out.getWindowSize()
    return { width, height }
  }

  raw(rawMode) {
    this.rawMode = !!rawMode
    return this.in.setMode?.(this.rawMode ? tty.constants.mode.RAW : tty.constants.mode.NORMAL)
  }
})()
