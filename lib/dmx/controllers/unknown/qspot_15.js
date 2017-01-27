const BaseController = require('../../controller/base_controller.js');
const blueprint = require('../../blueprint/unknown/qspot_15.js');

class Qspot15Wash_4ch extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_wash_4ch, address, buffer, opt);
    }
};

class Qspot15Wash extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_wash_12ch, address, buffer, opt);
    }
};

Qspot15Wash.mode4ch = Qspot15Wash_4ch;

class Qspot15Spot_5ch extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_spot_5ch, address, buffer, opt);
    }
};

class Qspot15Spot extends BaseController {
    static create(name, address, buffer, opt = {}) {
        return new this(name, address, buffer, opt);
    }
    constructor(name, address, buffer, opt = {}) {
        super(name, blueprint.mode_spot_13ch, address, buffer, opt);
    }
};

Qspot15Spot.mode5ch = Qspot15Spot_5ch;

module.exports = {
    Spot: Qspot15Spot,
    Wash: Qspot15Wash
};
