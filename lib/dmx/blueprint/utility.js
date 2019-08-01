const { memcpy } = require('bit-by-bit').container;

const make_rgb = (led_address) => {
    return {
        set: (values, buffer, address) => {
            if(Array.isArray(values)) {
                memcpy(buffer, address + led_address, values, 0, 3);
            } else {
                memcpy(buffer, address + led_address, [values.r, values.g, values.b], 0, 3);
            }
        },
        blackout: (values, buffer, address) => {
            buffer.fill(0, address + led_address, address + led_address + 3);
        },
        grey: (values, buffer, address) => {
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
        r: led_address,
        g: led_address + 1,
        b: led_address + 2,
    };
};

const make_rgbw = (led_address) => {
    return {
        set: (values, buffer, address) => {
            if(Array.isArray(values)) {
                memcpy(buffer, address + led_address, values, 0, 4);
            } else {
                if(values.w !== undefined) {
                    memcpy(buffer, address + led_address, [values.r, values.g, values.b], 0, 4);
                } else {
                    memcpy(buffer, address + led_address, [values.r, values.g, values.b, values.w], 0, 3);
                }
            }
        },
        blackout: (values, buffer, address) => {
            buffer.fill(0, address + led_address, address + led_address + 4);
        },
        grey: (values, buffer, address) => {
            buffer.fill(values[0], address + led_address, address + led_address + 4);
        },
        scale: ([ease], buffer, address, controller) => {
            buffer[address + led_address] = 0 ^ (buffer[address + led_address] * ease);
            buffer[address + led_address + 1] = 0 ^ (buffer[address + led_address + 1] * ease);
            buffer[address + led_address + 2] = 0 ^ (buffer[address + led_address + 2] * ease);
            buffer[address + led_address + 3] = 0 ^ (buffer[address + led_address + 3] * ease);
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

const make_rgb_unit = (...led_addresses) => {
    const res = led_addresses.map((led_address, i) => make_rgb(led_address));
    res.r = (values, buffer, address, controller) => led_address.map((led_address, i) => {

    });
    return res;
};

const make_range = (from, to) => ({ from, to });

module.exports = {
    memcpy,
    make_rgb,
    make_rgbw,
    make_range
};
