const memcpy = (dst, dst_offset, src, src_offset, length) => {
    for(let i = 0; i < length; ++i) dst[dst_offset + i] = src[src_offset + i];
}

const fill = (dst, dst_offset, value, length) => {
    for(let i = 0; i < length; ++i) dst[dst_offset + i] = values;
};

const make_rgb = (led_address) => {
    return {
        set: (values, buffer, address) => {
            memcpy(buffer, address + led_address - 2, values, 0, 3);
        },
        0: led_address - 1,
        1: led_address,
        2: led_address + 1,
        r: led_address - 1,
        g: led_address,
        b: led_address + 1,
    };
};

const make_rgbw = (led_address) => {
    return {
        set: (values, buffer, address) => {
            memcpy(buffer, address + led_address - 2, values, 0, 4);
        },
        0: led_address - 1,
        1: led_address,
        2: led_address + 1,
        3: led_address + 2,
        r: led_address - 1,
        g: led_address,
        b: led_address + 1,
        w: led_address + 2
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