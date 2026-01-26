const tty = require('bare-tty')
const { Writable, Readable } = require('bare-stream')
const fs = require('bare-fs')

module.exports = new (class Stdio {
  static WriteStream = class FdWriteStream extends Writable {
    constructor(fd) {
      super({ map: (data) => (typeof data === 'string' ? Buffer.from(data) : data) })
      this.fd = fd
    }

    _writev(batch, cb) {
      fs.writev(
        this.fd,
        batch.map(({ chunk }) => chunk),
        cb
      )
    }
  }

  static ReadStream = class FdReadStream extends Readable {
    constructor(fd) {
      super()
      this.fd = fd
    }

    _read(size) {
      const buffer = Buffer.alloc(size)
      fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
        if (err) return this.destroy(err)
        if (bytesRead === 0) return this.push(null)
        this.push(buffer.slice(0, bytesRead))
      })
    }
  }

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
      this._in = tty.isTTY(0) ? new tty.ReadStream(0) : new this.constructor.ReadStream(0)
      this._in.once('close', () => {
        this._in = null
      })
    }
    return this._in
  }

  get out() {
    if (this._out === null) {
      this._out = tty.isTTY(1) ? new tty.WriteStream(1) : new this.constructor.WriteStream(1)
    }
    return this._out
  }

  get err() {
    if (this._err === null) {
      this._err = tty.isTTY(2) ? new tty.WriteStream(2) : new this.constructor.WriteStream(2)
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
