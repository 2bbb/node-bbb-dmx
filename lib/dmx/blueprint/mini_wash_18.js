const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('./utility.js');

const blueprints = {
    mode_5ch: {
        config: {
            model_name: 'Mini Wash 18: 5ch mode',
            dmx_length: 5,
            led_length: 1,
            initialize: (that) => {
                that.dimmer_strobe = 255;
                that.pan.move = 127;
                that.tilt.move = 127;
            }
        },
        model: {
            pan: {
                move: 1
            },
            tilt: {
                move: 2
            },
            dimmer_strobe: 3,
            color: 4
        }
    },
    mode_12ch: {
        config: {
            model_name: 'Mini Wash 18: 12ch mode',
            dmx_length: 12,
            led_length: 3
        },
        model: {
            pan: {
                move: 1,
                fine: 2
            },
            tilt: {
                move: 3,
                fine: 4
            },
            move_speed: 5,
            dimmer_strobe: 6,
            led: make_rgb(7),
            color: 10,
            color_speed: 11,
            auto_move: 12
        }
    }
};

module.exports = blueprints;