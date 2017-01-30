const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('../utility.js');

const power = 30;

const blueprints = {
    config: {
        model_name: 'Bar Led 3unit',
        dmx_length: 12,
        led_length: 9,
        power,
        initialize: (controller) => {
            controller.mode = 1;
            controller.dimmer = 255;
        }
    },
    model: {
        mode: 1,
        dimmer: 2,
        strobe: 3,
        led: {
            set: (values, buffer, address, controller) => {
                controller.led[0] = values;
                controller.led[1] = values;
                controller.led[2] = values;
            },
            blackout: (v, b, a, controller) => {
                controller.led[0].blackout();
                controller.led[1].blackout();
                controller.led[2].blackout();
            },
            grey: (values, b, a, controller) => {
                controller.led[0].grey = values;
                controller.led[1].grey = values;
                controller.led[2].grey = values;
            },
            0: make_rgb(4),
            1: make_rgb(7),
            2: make_rgb(10)
        },
    }
};

module.exports = blueprints;