
## Usage

```js
const { benchmark, histogram } = require('benchmark-utils'); // from Node
const { benchmark, histogram  } = require('./benchmark-utils.js'); // from file

const f = your_function // 
const args = [a, b, etc.] // Array with the args for your your_function

const trials = 100 // the number of trials
const options = null // optional, se below for properties.
```

Code in JS-file my-benchmark.js:


```js
histogram(f, args); // default usage, displays histogram in new browser window

histogram(f, args, trials, options=options); // with trials and options as arguments

```
or

```js
const result = benchmark(f, args, trials, options); // returns result for further analysis

```

### Run with Node:

```js
node my-benchmark.js
```

### Options

Format and default options:

```js
const options = {
    runs: 10, 
    cutoff: 200,
    range: [0, 200],
    histnorm: 'count',
    binsize: 5,
  }
```

Description of options:

runs: number of evaluations
cutoff: skip outliers above this value
range: x-axis range displayed in chart
histnorm: what to display on y-axis ['count'|'probability'] 
binsize: size of x-bins in chart

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[GitHub](https://www.github.com/gorlang/benchmark-utils).

git clone https://www.github.com/gorlang/benchmark-utils

npm install ../dir/to/benchmark-utils

## Features

Run this with node to get a simple benchmark of a javascript function with stats displayed as a histogram in a browser window.

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

[MIT](LICENSE)