const util = require('util');
const flatten = require('bit-by-bit').functional.flatten;

const get_address_pair_nested = (obj, addr = "") => {
    return Object.keys(obj).map((key) => {
        if(util.isFunction(obj[key])) {
            return {
                osc: addr + "/" + key,
                dmx: obj[key]
            }
        } else if(util.isObject(obj[key])) {
            return get_address_pair_nested(obj[key], addr + "/" + key);
        } else {
            return {
                osc: addr + "/" + key,
                dmx: obj[key]
            };
        }
    });
};

const get_address_pair = obj => flatten(get_address_pair_nested(obj));

module.exports = {
    get_address_pair
};