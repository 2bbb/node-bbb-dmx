const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { make_range } = require('../utility.js');

const make_spark_rgb = (led_address) => ({
    set: (values, buffer, address) => {
        if(Array.isArray(values)) {
            buffer[address + led_address] = values[0];
            buffer[address + led_address + 3] = values[1];
            buffer[address + led_address + 6] = values[2];
        } else {
            buffer[address + led_address] = values.r;
            buffer[address + led_address + 3] = values.g;
            buffer[address + led_address + 6] = values.b;
        }
    },
    blackout: (values, buffer, address) => {
        buffer.fill(0, address + led_address, address + led_address + 3);
    },
    grey: (values, buffer, address) => {
        buffer.fill(values[0], address + led_address, address + led_address + 3);
    },
    0: led_address,
    1: led_address + 3,
    2: led_address + 6,
    r: led_address,
    g: led_address + 3,
    b: led_address + 6,
});

const blueprints = {
    config: {
        manufacturer: 'Stage Evolution',
        model_name: 'LED Spark RGB 150',
        dmx_length: 13,
        led_length: 9,
        initialize: (controller) => {
            controller.duration = 255;
        }
    },
    model: {
        led: {
            set: (values, buffer, address, controller) => {
                console.log("set");
                controller.led[0] = values;
                controller.led[1] = values;
                controller.led[2] = values;
            },
            0: make_spark_rgb(1),
            1: make_spark_rgb(2),
            2: make_spark_rgb(3)
        },
        speed: 10,
        duration: 11,
        macro: 12,
        macro_speed: 13
    }
};

module.exports = blueprints;