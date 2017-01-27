const BaseController = require('../../controller/base_controller.js');
const blueprint = require('../../blueprint/unknown/matrix_moving_head5x5.js');

class MatrixMovingHead5x5_19ch extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_19ch, address, buffer, opt);
    }
};

class MatrixMovingHead5x5_29ch extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_29ch, address, buffer, opt);
    }
};

class MatrixMovingHead5x5 extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_117ch, address, buffer, opt);
    }
};

MatrixMovingHead5x5.mode19ch = MatrixMovingHead5x5_19ch;
MatrixMovingHead5x5.mode29ch = MatrixMovingHead5x5_29ch

module.exports = MatrixMovingHead5x5;
