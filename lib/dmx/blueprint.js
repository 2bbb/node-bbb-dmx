const lazier = require('lazier');

module.exports = lazier({
    MatrixMovingHead5x5: './blueprint/matrix_moving_head5x5.js',
    MiniWash18: './blueprint/mini_wash_18.js',
    Qspot15: './blueprint/qspot_15.js',
    MegaBarLedRC: './blueprint/american_dj/mega_bar_led_rc.js',
    LedSpark150RGB: './blueprint/stage_evolution/led_spark_150_rgb.js'
}, __dirname);