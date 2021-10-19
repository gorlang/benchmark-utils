const plot = require('nodeplotlib');
const stats = require('simple-statistics')

const benchmark = (function(){

function btime(f, args, trial_i) {
  	
  	const hrTime = process.hrtime();
  	const start = hrTime[0] * 1000000 + parseInt(hrTime[1] / 1000);
  	const res = (f ? (args ? f(...args) : f()) : null);
  	const hrTimeEnd = process.hrtime();
  	const end = hrTimeEnd[0] * 1000000 + parseInt(hrTimeEnd[1] / 1000);
	return {res: (trial_i == 0 ? res : null), t: Math.round(end - start), unit: "uS"};
}

function decorate(str, values) {
  values = (Array.isArray(values) ? values : [values]);
  let start = -1;
  let end = start;
  let key = null;
  values.forEach((value, i) => {
    start = str.indexOf("#", start + 1);
    end = str.indexOf(" ", start + 1);
    end = (end == -1 ? str.length : end);
    key = str.substring(start, end).trim();
    str = str.replace(key, value);
  })
  return str;
}

function getOptions() {
  return {
    runs: 10,
    cutoff: 200,
    range: [0, 200],
    histnorm: 'count',  // ['count'|'probability'] 
    binsize: 5,
  }
}

function setGetOptions(opts) {
	const options = getOptions();
	for (const property in opts) {
 		options[property] = opts[property];
	}
	return options;
}

function getLayout(title) {
  return {
    bargap: 0.01,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: title,
    xaxis: {title: "Time (μS)"}, 
    yaxis: {title: "Samples"},
  }
}

exports.benchmark = function benchmark(f, args=null, trials=1) {
	
	const btimes = [];
	for (var j=0;j<trials;j++) {
		btimes.push(btime(f, args, j));
	}
	const times = btimes.map(item=>item.t);
	const mean = times.reduce((a, b)=>(a + b))/times.length;
	return {res: btimes[0].res, mean: mean, unit: btimes[0].unit, trials: trials, times: times}
}

exports.histogram = function histogram(f, args, trials=100, opts=null) {

	const options = (opts == null ? getOptions() : setGetOptions(opts));
	const output = [];

	for(var i = 1; i <= options.runs; i++) {
	  output.push(
	      exports.benchmark(f, args, trials).times
	      .filter(x => x < options.cutoff));
	}

	const samples = output.flat();
	const sample_cut = Math.round(samples.length/(options.runs * trials) * 100);
	const plots = [];
	plots.push(
	  {x: samples, 
	  type: 'histogram',
	  histnorm: options.histnorm,
	  xbins: {end: options.range[1],
	          size: options.binsize, 
	          start: options.range[0]
	          },
	});

	const title = decorate(
	"x̄=#mean μS (M=#median μS), #samples samples (#sample_cut %) < #cutoff μS, with #trials trials (#runs evaluations)", 
	[Math.round(stats.mean(samples)), 
	stats.median(samples),
	samples.length,
	sample_cut,
	options.cutoff,
	trials * options.runs,
	options.runs]);

	plot.plot(plots, getLayout(title));
}

exports.benchmark_log = function benchmark_log(f, args=null, trials=1) {
	const res = exports.benchmark(f, args, trials);
	console.log(res);
	return res;
}

return exports;
})();

if (typeof module.exports === "object") module.exports = benchmark;
