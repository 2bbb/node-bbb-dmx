module.exports = (h, s = 255.0, v = 1.0) => {
    let r = 0, g = 0, b = 0;
	if(s != 0) {
        s /= 255.0;
        const i = ((h / 60) ^ 0) % 6,
              f = h / 60 - i;
        const p = v * (1.0 - s),
              q = v * (1.0 - s * f),
              t = v * (1.0 - s * (1 - f));
        switch(i) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
    }
    return {
        r: 0 ^ (255 * r),
        g: 0 ^ (255 * g),
        b: 0 ^ (255 * b),
    };
};
