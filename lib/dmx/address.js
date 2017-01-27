const {functional} = require('bit-by-bit');

const Range = require('./address/range.js');

const zero_str = functional.range(16).reduce((x, y) => "0" + x);
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
        functional.range(from - 1, to).forEach((i, index) => {
            // result[i] = (result[i] == ' - ') ? ' x ' : ' - ';
            result[i] = (result[i][0] == '\x1B')
                      ? result[i].replace('\x1B\[32m', '\x1B[1;3;37;41m')
                      : ('\x1B[32m' + (index == 0 ? '\x1B[1;4m' : '') + result[i] + '\x1B[0m')
        });
    });
    console.log("==== ==== ==== ====      address info.      ==== ==== ==== ====");
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