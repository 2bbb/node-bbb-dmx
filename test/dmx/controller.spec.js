const { dmx, functional } = require('bbb-dmx.js');
const { make_rgb } = dmx.blueprint.utility;

const simple_light = {
    config: {
        dmx_length: 9,
        led_length: 9,
        initialize: (controller) => {
            controller.led = [255, 0, 0];
        }
    },
    model: {
        led: {
            set: (values, buffer, address, controller) => [0, 1, 2].map(i => controller.led[i] = values),
            blackout: (v, b, a, controller) => [0, 1, 2].map(i => controller.led[i].blackout()),
            grey: (values, b, a, controller) => [0, 1, 2].map(i => controller.led[i].grey = values[0]),
            scale: ([ease], b, a, controller) => [0, 1, 2].map(i => controller.scale(ease)),
            r: (values, buffer, address, controller) => [0, 1, 2].map(i => controller.led[i].r = values[0]),
            g: (values, buffer, address, controller) => [0, 1, 2].map(i => controller.led[i].g = values[0]),
            b: (values, buffer, address, controller) => [0, 1, 2].map(i => controller.led[i].b = values[0]),
            0: make_rgb(1),
            1: make_rgb(4),
            2: make_rgb(7)
        }
    }
};

describe('bbb.dmx.controller', () => {
    const buffer = functional.range(30);
    buffer.fill(0);
    const controller = dmx.controller.create("test", simple_light, 8, buffer);
    it('controller will initialize', () => {
        expect(buffer[7]).toBe(255);
        expect(buffer[8]).toBe(0);
        expect(buffer[9]).toBe(0);
        expect(buffer[10]).toBe(255);
        expect(buffer[11]).toBe(0);
        expect(buffer[12]).toBe(0);
        expect(buffer[13]).toBe(255);
        expect(buffer[14]).toBe(0);
        expect(buffer[15]).toBe(0);
    });
    it('controller.led[0].r set correctly', () => {
        controller.led[0].r = 15;
        expect(buffer[7]).toBe(15);
        expect(buffer[10]).toBe(255);
        expect(buffer[13]).toBe(255);
    });
    it('controller.led.r set correctly', () => {
        controller.led.r = [17];
        expect(buffer[7]).toBe(17);
        expect(buffer[10]).toBe(17);
        expect(buffer[13]).toBe(17);
    });
});