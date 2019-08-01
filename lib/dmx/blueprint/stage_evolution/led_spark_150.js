const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { make_range } = require('../utility.js');

const make_spark = (led_address) => {
    return {
        set: (values, buffer, address) => {
            console.log("set", values);
            if(Array.isArray(values)) {
                buffer[address + led_address] = values[0];
                buffer[address + led_address + 1] = values[1];
                buffer[address + led_address + 2] = values[2];
            }
        },
        blackout: (values, buffer, address) => {
            buffer.fill(0, address + led_address, address + led_address + 3);
        },
        all: (values, buffer, address) => {
            buffer.fill(values[0], address + led_address, address + led_address + 3);
        },
        scale: ([ease], buffer, address, controller) => {
            buffer[address + led_address] = 0 ^ (buffer[address + led_address] * ease);
            buffer[address + led_address + 1] = 0 ^ (buffer[address + led_address + 1] * ease);
            buffer[address + led_address + 2] = 0 ^ (buffer[address + led_address + 2] * ease);
        },
        0: led_address,
        1: led_address + 1,
        2: led_address + 2,
    };
};

const blueprints = {
    config: {
        manufacturer: 'Stage Evolution',
        model_name: 'LED Spark 150',
        dmx_length: 7,
        led_length: 3,
        power: 180,
        initialize: (controller) => {
            controller.duration = 255;
        }
    },
    model: {
        led: make_spark(1),
        speed: 4,
        duration: 5,
        macro: 6,
        macro_speed: 7
    }
};

module.exports = blueprints;