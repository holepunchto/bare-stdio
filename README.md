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

See the [`bare-stdio` reference](https://docs.pears.com/reference/bare/modules/bare-stdio).

## License

Apache-2.0
