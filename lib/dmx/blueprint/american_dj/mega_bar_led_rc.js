const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('../utility.js');

const blueprints = {
    mode_3ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Mega Bar LED RC: 3ch mode [D-P1]',
            dmx_length: 3,
            led_length: 3,
            initialize: () => {}
        },
        model: {
            led: make_rgb(1)
        }
    },
    mode_4ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Mega Bar LED RC: 4ch mode [D-P2]',
            dmx_length: 4,
            led_length: 3,
            initialize: (controller) => {
                controller.dimmer = 255;
            }
        },
        model: {
            led: make_rgb(1),
            dimmer: 4
        }
    },
    mode_11ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Mega Bar LED RC: 11ch mode [D-P3]',
            dmx_length: 11,
            led_length: 9,
            initialize: (controller) => {
                controller.dimmer = 255;
            }
        },
        model: {
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
                0: make_rgb(1),
                1: make_rgb(4),
                2: make_rgb(7)
            },
            strobe: 10,
            dimmer: 11,
        }
    }
};

module.exports = blueprints;