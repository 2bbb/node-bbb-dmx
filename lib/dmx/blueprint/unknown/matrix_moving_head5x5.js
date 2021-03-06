const util = require('util');
const { flatten, range } = require('bit-by-bit').functional;
const { memcpy, make_rgbw, make_range } = require('../utility.js');

const fill_n = (dst, dst_offset, src, src_offset, unit, length) => {
    for(let i = 0; i < length ; i += unit) {
        memcpy(dst, dst_offset + i, src, src_offset, Math.min(unit, length - i));
    }
}

const Constant = {
    Unlimited: {
        Default: 0,
        Clockwise: make_range(56, 155),
        Reversely: make_range(156, 255)
    },
    Strobe: {
        NoFunction: 0,
        SameStep: make_range(4, 95),
        Random: make_range(96, 176),
        Thunder: make_range(177, 255)
    },
    Numbers: {
        Numbers: 0,
        Punctuations: make_range(90, 233),
        WaterEffect: 234
    },
    Letters: {
        AtoZ: make_range(0, 233),
        WaterEffect: 234
    },
    StaticGobos: {
        Show: make_range(0, 233),
        WaterEffect: 234
    },
    DynamicGobos: {
        Show: make_range(0, 233),
        WaterEffect: 234
    },
    Macro: {
        NoFunction: 0,
        Numbers: 50,
        Letters: 75,
        StaticGobos: 100,
        DynamicGobos: 125,
        AutoRun: 150,
        SoundActivated: 200
    },
    Reset: {
        NoFunction: 0,
        ResetWithin3seconds: 251
    }
};

const make_from_template = (led, led_length) => ({
    move: (values, buffer, address, controller) => {
        if(values.length < 4) {
            controller.pan.move = values[0];
            controller.tilt.move = values[1];
        } else if(4 <= values.length) {
            controller.pan.move = values[0];
            controller.pan.fine = values[1];
            controller.tilt.move = values[2];
            controller.tilt.fine = values[3];
        }
    },
    pan: {
        move: 1,
        fine: 3,
        unlimited: 2
    },
    tilt: {
        move: 4,
        fine: 6,
        unlimited: 5
    },
    moving_speed: 7,
    master: 8,
    strobe: 9,
    effect: {
        mode: {
            numbers: led_length + 10,
            letters: led_length + 11,
            static_gobos: led_length + 12,
            dynamic_gobos: led_length + 14
        },
        setting: {
            color: led_length + 13,
            speed: led_length + 15
        }
    },
    macro: led_length + 16,
    reset: led_length + 17,
    led: led
});

const range3 = range(3);
const range4 = range(4);
const range5 = range(5);

const make_single = () => {
    const res = make_rgbw(8);
    res.blackout = (values, buffer, address) => {
        buffer.fill(0, address + 7, 4);
    }
    res.grey = (values, buffer, address) => {
        buffer.fill(values[0], address + 7, 4);
    }
};

const led_start_address = 10;

const make_3unit = () => {
    const res = {
        all: (values, buffer, address) => {
            memcpy(buffer, address + led_start_address, values, 0, Math.min(buffer.length, 12));
        },
        set: ([index, ...values], buffer, address) => {
            memcpy(buffer, address + led_start_address + index * 4, values, 0, Math.min(buffer.length, 4));
        },
        blackout: (values, buffer, address) => {
            buffer.fill(0, address + led_start_address, address + led_start_address + 12);
        },
        grey: (values, buffer, address) => {
            buffer.fill(values[0], address + led_start_address, address + led_start_address + 12);
        }
    };
    range(3).forEach(i => { res[i] = make_rgbw(led_start_address + 4 * i); });
}

const make_5x5 = () => {
    const res = {
        // /led/all r g b w
        all: (values, buffer, address) => {
            memcpy(buffer, address + led_start_address, values, 0, Math.min(buffer.length, 100));
        },
        // /led/w/y r g b w
        w: range5.map(j => {
            return (values, buffer, address) => {
                console.log(`/led/w/${j}`, values);
                fill_n(buffer, address + led_start_address + 20 * j, values, 0, 4, 20);
            };
        }),
        // /led/h/x r g b w
        h: range(5).map(i => {
            return (values, buffer, address) => {
                range5.forEach(j => {
                    memcpy(buffer, address + led_start_address + 4 * (5 * j + i), values, 0, 4);
                });
            };
        }),
        unit: {
            set: ([n, ...values], buffer, address) => {
                make_5x5.unit[n](values, buffer, address);
            },
            0: (values, buffer, address) => {
                [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].forEach(i => {
                    memcpy(buffer, address + led_start_address + 4 * i, values, 0, 4);
                });
            },
            1: (values, buffer, address) => {
                [6, 7, 8, 11, 13, 16, 17, 18].forEach(i => {
                    memcpy(buffer, address + led_start_address + 4 * i, values, 0, 4);
                });
            },
            2: (values, buffer, address) => {
                memcpy(buffer, address + led_start_address + 4 * 12, values, 0, 4);
            },
        },
        // /led/set_at x y r g b w
        set_at: ([i, j, ...values], buffer, address) => {
            memcpy(buffer, address + led_start_address + 4 * (5 * j + i), values, 4);
        },
        // /led/set r g b w
        set: (values, buffer, address) => {
            fill_n(buffer, address + led_start_address, values, 0, 4, 100);
        },
        // /led/blackout
        blackout: (values, buffer, address) => {
            buffer.fill(0, address + led_start_address, address + led_start_address + 100);
        },
        // /led/grey grey_scale
        grey: (values, buffer, address) => {
            buffer.fill(values[0], address + led_start_address, address + led_start_address + 100);
        },
        scale: ([ease], b, a, controller) => {
            range(25).forEach((i) => {
                controller.led[0 ^ (i / 5)][i % 5].scale(ease);
                controller.led[0 ^ (i / 5)][i % 5].scale(ease);
                controller.led[0 ^ (i / 5)][i % 5].scale(ease);
            });
        },
    };
    range(5).forEach(j => {
        res[j] = {};
        range(5).forEach(i => {
            res[j][i] = make_rgbw(led_start_address + 4 * (i + j * 5));
        });
    });
    return res;
};

const blueprints = {
    mode_19ch: {
        config: {
            model_name: "Matrix Moving Head 5x5: 19ch mode",
            dmx_length: 19,
            led_length: 4,
            initialize: (controller) => {
                controller.master = 255;
            }
        },
        model: {
            move: (values, buffer, address, controller) => {
                controller.pan.move = values[0];
                controller.tilt.move = values[1];
            },
            pan: {
                move: 1,
                unlimited: 2
            },
            tilt: {
                move: 3,
                unlimited: 4
            },
            moving_speed: 5,
            master: 6,
            strobe: 7,
            led: make_single(),
            effect: {
                mode: {
                    numbers: 12,
                    letters: 13,
                    static_gobos: 14,
                    dynamic_gobos: 16
                },
                setting: {
                    color: 15,
                    speed: 17
                }
            },
            macro: 18,
            reset: 19,
        }
    },
    mode_29ch: {
        config: {
            model_name: "Matrix Moving Head 5x5: 29ch mode",
            dmx_length: 29,
            led_length: 12,
            initialize: (controller) => {
                controller.master = 255;
            }
        },
        model: make_from_template(make_3unit(), 12)
    },
    mode_117ch: {
        config: {
            model_name: "Matrix Moving Head 5x5: 117ch mode",
            dmx_length: 117,
            led_length: 100,
            initialize: (controller) => {
                controller.master = 255;
            }
        },
        model: make_from_template(make_5x5(), 100)
    }
};

module.exports = blueprints;