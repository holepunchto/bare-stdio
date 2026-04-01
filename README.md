# bare-stdio

Standard input/output streams for Bare.

```
npm i bare-stdio
```

## Usage

```js
const stdio = require('bare-stdio')

// Write to stdout
stdio.out.write('Hello, World!\n')

// Write to stderr
stdio.err.write('An error occurred\n')

// Read from stdin
stdio.in.on('data', (data) => {
  console.log('Received:', data.toString())
})
```

## API

#### `stdio.in`

A readable stream for standard input (`fd 0`). Returns a TTY stream if stdin is a terminal, otherwise returns a basic file descriptor read stream.

#### `stdio.out`

A writable stream for standard output (`fd 1`). Returns a TTY stream if stdout is a terminal, otherwise returns a basic file descriptor write stream.

#### `stdio.err`

A writable stream for standard error (`fd 2`). Returns a TTY stream if stderr is a terminal, otherwise returns a basic file descriptor write stream.

#### `stdio.inAttached`

Boolean indicating whether the input stream has been initialized.

#### `stdio.size()`

Returns the terminal window size as `{ width, height }`. Defaults to `{ width: 80, height: 80 }` if the output is not a TTY.

#### `stdio.raw(rawMode)`

Sets the terminal raw mode. When `rawMode` is `true`, input is passed through without processing (no line buffering, no echoing, etc.). Only works when stdin is a TTY.

## License

Apache-2.0
