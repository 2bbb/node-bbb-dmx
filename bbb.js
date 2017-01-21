const lazier = require('lazier');
const bbb = require('bit-by-bit');

const bbb_dmx = lazier({
	artnet: './lib/artnet.js',
	dmx: './lib/dmx.js'
}, __dirname);
bbb_dmx.functional = bbb.functional;
bbb_dmx.osc = bbb.osc;

module.exports = bbb_dmx;