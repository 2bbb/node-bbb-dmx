const {memcpy, fill} = require('bit-by-bit').container;

const make_rgb = (led_address) => {
    return {
        set: (values, buffer, address) => {
            memcpy(buffer, address + led_address, values, 0, 3);
        },
        grey: (values, buffer, address) => {
            fill(buffer, address + led_address, values[0], 3);
        },
        0: led_address,
        1: led_address + 1,
        2: led_address + 2,
        r: led_address,
        g: led_address + 1,
        b: led_address + 2,
    };
};

const make_rgbw = (led_address) => {
    return {
        set: (values, buffer, address) => {
            memcpy(buffer, address + led_address, values, 0, 4);
        },
        grey: (values, buffer, address) => {
            fill(buffer, address + led_address, values[0], 4);
        },
        0: led_address,
        1: led_address + 1,
        2: led_address + 2,
        3: led_address + 3,
        r: led_address,
        g: led_address + 1,
        b: led_address + 2,
        w: led_address + 3
    };
};

const make_range = (from, to) => ({ from, to });

module.exports = {
    memcpy,
    fill,
    make_rgb,
    make_rgbw,
    make_range
};