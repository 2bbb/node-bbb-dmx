const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgb, make_range } = require('../utility.js');

const initialize = (that) => {
    that.dimmer_strobe = 255;
};

const blueprints = {
    mode_wash_4ch: {
        config: {
            model_name: 'Qspot 15: 4ch wash mode',
            dmx_length: 4,
            led_length: 1,
            initialize
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
    mode_spot_5ch: {
        config: {
            model_name: 'Qspot 15: 5ch spot mode',
            dmx_length: 5,
            led_length: 1,
            initialize
        },
        model: {
            pan: {
                move: 1
            },
            tilt: {
                move: 2
            },
            dimmer_strobe: 3,
            color: 4,
            gobo: 5
        }
    },
    mode_wash_12ch: {
        config: {
            model_name: 'Qspot 15: 12ch wash mode',
            dmx_length: 12,
            led_length: 3,
            initialize
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
    },
    mode_spot_13ch: {
        config: {
            model_name: 'Qspot 15: 13ch spot mode',
            dmx_length: 13,
            led_length: 3,
            initialize
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
            auto_move: 12,
            gobo: 13
        }
    }
};

module.exports = blueprints;
