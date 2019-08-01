const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('../utility.js');

const power = 53;

const make_led = led_address => ({
    set: (values, buffer, address) => {
        buffer[address + led_address + 0] = values[0];
        buffer[address + led_address + 1] = values[1];
    },
    blackout: (values, buffer, address) => {
        this.set([0, 0], buffer, address);
    },
    0: led_address,
    1: led_address + 1,
    cool: led_address,
    warm: led_address + 1,
});

const blueprints = {
    mode_3ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Flat Par CWWW18: 3ch mode [1XXX]',
            dmx_length: 3,
            led_length: 2,
            power,
            initialize: () => {}
        },
        model: {
            led: make_led(1),
            white_balance: 3,
        }
    },
    mode_4ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Flat Par CWWW18: 4ch mode [2XXX]',
            dmx_length: 4,
            led_length: 2,
            power,
            initialize: () => {}
        },
        model: {
            led: make_led(1),
            white_balance: 3,
            strobe: 4,
        }
    },
    mode_5ch: {
        config: {
            manufacturer: 'American DJ',
            model_name: 'Flat Par CWWW18: 5ch mode [3XXX]',
            dmx_length: 5,
            led_length: 2,
            power,
            initialize: (controller) => {
                controller.dimmer = 255;
            }
        },
        model: {
            led: make_led(1),
            white_balance: 3,
            strobe: 4,
            dimmer: 5,
        }
    }
};

module.exports = blueprints;