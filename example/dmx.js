const { osc, dmx, functional, artnet } = require('../bbb-dmx.js');

const client = artnet.Clients.create('192.168.1.101', { size: 512 });
const buffer = client.get();

const osc_port = 8888;

const qspot15 = dmx.controllers.Qspot15.Spot.create(
    "qspot15",
    21,
    buffer,
    { osc_port }
);

const matrix5x5 = dmx.controllers.MatrixMovingHead5x5.create(
    "left",
    101,
    buffer,
    { osc_port }
);
matrix5x5.master = 255;
matrix5x5.led[0][0].r = 255;
matrix5x5.led[0][1].r = 255;
matrix5x5.led[1][0].r = 255;
matrix5x5.led[4][4].r = 255;
matrix5x5.led[4][4].g = 255;
matrix5x5.led[4][4].b = 255;
matrix5x5.led[4][4].w = 255;

const miniWashes = dmx.controller.createUnit(
    "mini18", 
    dmx.blueprint.MiniWash18.mode_12ch,
    {
        1: 51, 2: 66, 3: 81, 4: 251, 5: 266, 6: 281, 7: 296, 8: 311
    },
    buffer,
    { osc_port }
);
miniWashes.dimmer_strobe = 255;
miniWashes.pan.move = 127;
miniWashes.tilt.move = 127;

osc.subscribe(osc_port, "/print", () => {
    console.log(new Date());
    functional.object.forEach(miniWashes.controllers, (wash, key) => {
        const address = wash.dmxAddress;
        const length = wash.dmxLength;
        console.log("%s/%s address: %d, length: %d", miniWashes.name, key, address, length);
        console.log(buffer.slice(address - 1, address + length - 1));
    });
    console.log("%s/%s address: %d, length: %d", miniWashes.name, matrix5x5.address, matrix5x5.dmxLength);
    console.log(JSON.stringify(buffer.slice(matrix5x5.address - 1, matrix5x5.address + matrix5x5.dmxLength - 1)));
});

const miniWashesDirection = functional.range(1, 9);

osc.subscribe(osc_port, "/move_tilt", ([address, move_to, duration, direction], rinfo) => {
    miniWashesDirection.forEach((key, index) => {
    const wait_for = (!direction)
                   ? (index * duration)
                   : ((miniWashesDirection.length - index - 1) * duration);
        setTimeout(() => {
            miniWashes[key].tilt.move = move_to;
        }, wait_for);
    });
});
