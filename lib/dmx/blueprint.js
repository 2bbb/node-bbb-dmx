const lazier = require('lazier');

const blueprint_list = {
    MatrixMovingHead5x5: './blueprint/unknown/matrix_moving_head5x5.js',
    MiniWash18: './blueprint/unknown/mini_wash_18.js',
    Qspot15: './blueprint/unknown/qspot_15.js',
    BarLed3Unit: './blueprint/unknown/bar_led_3unit.js',
    MegaBarLedRC: './blueprint/american_dj/mega_bar_led_rc.js',
    PunchLedPro: './blueprint/american_dj/punch_led_pro.js',
    FlatParCWWW18: '/blueprint/american_dj/flat_par_cwww18.js',
    LedSpark150RGB: './blueprint/stage_evolution/led_spark_150_rgb.js',
    LedSpark150: './blueprint/stage_evolution/led_spark_150.js',
};

const print_config = (config) => {
    if(!config) return;
    console.log(`    ${config.manufacturer ? config.manufacturer : 'unknown manufacturer'}
    ${config.model_name}
    dmx length: ${config.dmx_length}
    led length: ${config.led_length}
    power [W] : ${config.power}
`);
};

const blueprints = lazier(blueprint_list, __dirname);
blueprints.list = () => {
    for(let key in blueprint_list) {
        if(blueprints[key].config) {
            console.log(key);
            print_config(blueprints[key].config);
        } else {
            for(let subkey in blueprints[key]) {
                console.log(key + '.' + subkey);
                print_config(blueprints[key][subkey].config);
            }
        }
    }
};

module.exports = blueprints;
