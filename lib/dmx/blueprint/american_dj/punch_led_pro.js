const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('../utility.js');

const power = 34;

const blueprints = {
    mode_3ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Punch LED Pro: 3ch mode [888.]',
            dmx_length: 3,
            led_length: 3,
            power,
            initialize: () => {}
        },
        model: {
            led: make_rgb(1)
        }
    },
    mode_4ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Punch LED Pro: 6ch mode [888]',
            dmx_length: 6,
            led_length: 3,
            power,
            initialize: (controller) => {
                controller.strobe = 0;
            }
        },
        model: {
            led: make_rgb(1),
            macro: 4,
            strobe: 5,
            mode: 6
        }
    },
    mode_7ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Punch LED Pro: 7ch mode [88.8]',
            dmx_length: 7,
            led_length: 3,
            power,
            initialize: (controller) => {
                controller.strobe = 0;
                controller.dimmer = 255;
            }
        },
        model: {
            led: make_rgb(1),
            macro: 4,
            strobe: 5,
            mode: 6,
            dimmer: 7,
        }
    }
};

module.exports = blueprints;