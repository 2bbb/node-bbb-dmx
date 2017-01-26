const {functional} = require('bit-by-bit');

const Range = require('./address/range.js');

const zero_str = functional.range(256).reduce((x, y) => "0" + x);
const zero_pad = (i, n) => {
    const tmp = zero_str + i;
    return tmp.substr(tmp.length - n);
};

const calculateMap = (...ranges) => {
    return functional.flatten(ranges).sort(Range.compare);
};

const printFreeAddress = (...ranges) => {
    const result = functional.range(1, 513).map(i => zero_pad(i, 3));
    ranges = calculateMap(...ranges);
    ranges.forEach(({from, to}) => {
        functional.range(from - 1, to).forEach(i => {
            result[i] = (result[i] == ' - ') ? ' x ' : ' - ';
        });
    });
    functional.range(32).forEach(i => console.log(result.slice(16 * i, 16 * i + 16).join(" ")));
};

const checkConflict = (...ranges) => {
    for(const range of ranges) {
        if(ranges.some(other => (range !== other) && range.crossTo(other))) return true;
    }
    return false;
};

module.exports = {
    Range,
    calculateMap,
    printFreeAddress,
    checkConflict
};