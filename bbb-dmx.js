const lazier = require('lazier');
const bbb = require('bit-by-bit');

const bbb_dmx = lazier({
	artnet: './lib/artnet.js',
	dmx: './lib/dmx.js',
	color: './lib/color.js',
	chase: './lib/chase.js'
}, __dirname);
bbb_dmx.functional = bbb.functional;
bbb_dmx.osc = bbb.osc;
bbb_dmx.math = bbb.math;
bbb_dmx.container = bbb.container;

module.exports = bbb_dmx;