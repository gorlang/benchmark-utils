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
    histnorm: 'probability',  // ['count'|'probability'] 
    binsize: 5,
    showstd: false,
    theme: 'dark', // ['light'|'dark']
  }
}

function setGetOptions(opts) {
	const options = getOptions();
	for (const property in opts) {
		options[property] = opts[property];
	}
	return options;
}

function getChartName(options) {
	return (options.histnorm == 'probability' ? 'Probability' : 'Count')
}

function getLayout(title, options) {

	return {
		bargap: 0.01,
		bargroupgap: 0.2,
		barmode: "overlay",
		title: title,
		xaxis: {title: "Time (μS)"}, 
		yaxis: {title: getChartName(options)},
	}
}

function setTheme(layout, theme) {

	if (theme == 'dark') {
		const dark = {
			paper_bgcolor: "#222",
			plot_bgcolor: "#222",
			font: { color: "#fff", size: 12},
		};
		for (const property in dark) {
			layout[property] = dark[property];
		}
	}
	return layout;
}

function getLine(x, name="", y=0.05) {
	return {x: [x, x],
		y: [0, y],
		type: 'line',
		name: name
	}
}

function addStd(plots, samples, mean) {
	const std = stats.standardDeviation(samples);
	plots.push(getLine(mean + std, "+σ"));
	plots.push(getLine(mean - std, "-σ"));
}

function getTitle(options, samples, mean, trials) {

	const sample_cut = Math.round(samples.length/(options.runs * trials) * 100);
	return decorate(
	"x̄=#mean μS, #samples samples (#sample_cut %) < #cutoff μS (#trials trials, #runs evaluations)", 
	[Math.round(mean), 
	samples.length,
	sample_cut,
	options.cutoff,
	trials * options.runs,
	options.runs]);
}

exports.benchmark = function benchmark(f, args=null, trials=1) {
	
	const btimes = [];
	for (let j=0;j<trials;j++) {
		btimes.push(btime(f, args, j));
	}
	const times = btimes.map(item=>item.t);
	const mean = times.reduce((a, b)=>(a + b))/times.length;
	return {res: btimes[0].res, mean: mean, unit: btimes[0].unit, trials: trials, times: times}
}

exports.histogram = function histogram(f, args, trials=100, opts=null) {

	const options = (opts == null ? getOptions() : setGetOptions(opts));
	const output = [];

	for(let i = 1; i <= options.runs; i++) {
	  output.push(
	      exports.benchmark(f, args, trials).times
	      .filter(x => x < options.cutoff));
	}

	const samples = output.flat();
	const plots = [];
	plots.push(
	  {x: samples, 
	  type: 'histogram',
	  name: getChartName(options),
	  histnorm: options.histnorm,
	  xbins: {end: options.range[1],
	          size: options.binsize, 
	          start: options.range[0]
	          },
	});

	const mean = stats.mean(samples);
	plots.push(getLine(mean, "x̄"));
	if (options.showstd) {
		addStd(plots, samples, mean);
	}

	const title = getTitle(options, samples, mean, trials);
	plot.plot(plots, setTheme(getLayout(title, options), options.theme));
}

exports.benchmark_log = function benchmark_log(f, args=null, trials=1) {
	const res = exports.benchmark(f, args, trials);
	console.log(res);
	return res;
}

return exports;
})();

if (typeof module.exports === "object") module.exports = benchmark;
