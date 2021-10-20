
## Usage

```js
const { benchmark, histogram } = require('benchmark-utils'); // from Node
const { benchmark, histogram  } = require('./benchmark-utils.js'); // from file

const f = your_function // function name wihtout ()
const args = [a, b, etc.] // Array with the args for your your_function

const trials = 100 // the number of trials
const options = null // optional, see below for properties.
```

Create a new file 'my-benchmark.js' and add:

```js

const f = your_function // the function (name) to test without ()
const args = [a, b, etc.] // args to the function
histogram(f, args); // default usage, displays histogram with benchmark result in new browser window

```
or use

```js

histogram(f, args, trials, options); // with trials and options (see below) as arguments

const result = benchmark(f, args, trials, options); // no chart, only returns result for further analysis

```

### Run with Node:

```js
node my-benchmark.js
```

### Options

Default options:

```js
const options = {
    runs: 10, // number of evaluations
    cutoff: 200, // skip outliers above this value
    range: [0, 200], // x-axis range displayed in chart
    histnorm: 'count', // what to display on y-axis ['count'|'probability'] 
    binsize: 5, // width of x-bins in chart
    showstd: false, // display standard deviation markers
    theme: 'dark' // ['dark'|'light']
  }
```
Note: If using the dark theme you might want to add 'body {background-color: #000;},' to the style-tag in file: ./node_modules/nodeplotlib/dist/www/index.html to change the page background color.

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