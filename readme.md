
## Usage

```js
const { benchmark, histogram } = require('benchmark-utils'); // from Node
const { benchmark, histogram  } = require('./benchmark-utils.js'); // from file

const f = your_function // 
const args = [a, b, etc.] // Array with the args for your your_function

const trials = 100 // the number of trials in each evaluation
const options = null // optional
```

### Code in JS-file benchmark.js:

```js
histogram(f, args, trials, options);

```

### Run with Node:

```js
node benchmark.js
```

### Options

```js
{
    runs: 10,
    cutoff: 200,
    range: [0, 200],
    histnorm: 'count',  // ['count'|'probability'] 
    binsize: 5,
  }
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[GitHub](https://www.github.com/gorlang/benchmark-utils).

git clone https://www.github.com/gorlang/benchmark-utils

npm install ../dir/to/benchmark-utils

## Features

Run this from node to show a simple benchmark of javascript functions with stats displayed as histogram in a browser.

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)