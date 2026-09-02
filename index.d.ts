import { ReadStream as TTYReadStream, WriteStream as TTYWriteStream } from 'bare-tty'
import Pipe from 'bare-pipe'
import { ReadStream as FileReadStream, WriteStream as FileWriteStream } from 'bare-fs'

interface IO {
  readonly in: TTYReadStream | Pipe | FileReadStream
  readonly out: TTYWriteStream | Pipe | FileWriteStream
  readonly err: TTYWriteStream | Pipe | FileWriteStream
}

/**
 * The standard I/O streams: `in` — a readable stream for standard input (fd `0`), `out` — a
 * writable stream for standard output (fd `1`), and `err` — a writable stream for standard error
 * (fd `2`). Each is created lazily on first access: a `bare-tty` stream if the file descriptor is a
 * terminal, a `bare-pipe` `Pipe` if it's a pipe, otherwise a `bare-fs` stream.
 */
declare const io: IO

export = io
