const {hsb2rgb} = require('../color.js');

const {random, lerp} = require('bit-by-bit').math;

module.exports = (duration) => {
    const context = {
        from: random(255) ^ 0,
        to: random(255) ^ 0,
        start: new Date()
    };
    return () => {
        const now = new Date();
        const elapsed = (now - context.start) * 0.001;
        if(duration < elapsed) {
            context.start = now;
            context.from = context.to;
            context.to = random(255) ^ 0;
            return hsb2rgb(context.from);
        } else {
            return hsb2rgb(lerp(context.from, context.to, elapsed / duration));
        }
    };
};