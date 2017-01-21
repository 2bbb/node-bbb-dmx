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

const controller = dmx.controllers.MatrixMovingHead5x5.create(
    "left",
    101,
    buffer,
    { osc_port }
);

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


// controller.master = 255;
osc.subscribe(osc_port, "/print", () => {
    console.log(new Date(), JSON.stringify(buffer));
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