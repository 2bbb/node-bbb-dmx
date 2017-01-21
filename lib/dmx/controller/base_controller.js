const util = require('util');
const osc = require('../../osc.js');
const utility = require('./utility.js');

class BaseController {
    static create(name, blueprint, address, buffer, opt = {}) {
        return new BaseController(name, blueprint, address, buffer, opt);
    }
    constructor(name, blueprint, address, buffer, opt = {}) {
        this.name = name;
        this.blueprint = blueprint;
        this.model = this.blueprint.model;
        this.address = address;
        this.buffer = buffer;

        let { osc_port } = opt;

        if(osc_port) {
            if(!util.isArray(osc_port)) osc_port = [osc_port];
            const pairs = utility.osc.get_address_pair(this.model)
                .map(pair => ({
                    osc: util.format("/%s%s", this.name, pair.osc),
                    dmx: pair.dmx
                }));
            osc_port.forEach(port => {
                pairs.forEach(pair => {
                    console.log("osc: ", pair.osc);
                    if(util.isFunction(pair.dmx)) {
                        osc.subscribe(port, pair.osc, ([address, ...values]) => {
                            pair.dmx(values, this.buffer, this.address);
                        });
                    } else {
                        osc.subscribe(port, pair.osc, ([address, ...values]) => {
                            this.set(pair.dmx, values[0]);
                        });
                    }
                });
            });
        }
        this.extend();
    }

    get uniqueName() {
        return this.name;
    }
    get modelName() {
        return this.model.config.model_name;
    }
    get dmxLength() {
        return this.model.config.dmx_length;
    }
    get ledLength() {
        return this.model.config.led_length;
    }

    set(n, value) {
        return this.buffer[n + this.address - 2] = value;
    }
    get(n) {
        return this.buffer[n + this.address - 2];
    }
    extend() {
        this.create_interface(this.model, this);
    }
    create_interface(blueprint, object) {
        Object.keys(blueprint).forEach(key => {
            const value = blueprint[key];
            if(util.isFunction(value)) {
                object.__defineSetter__(key, v => value(v, this.buffer, this.address));
            } else if(util.isArray(value)) {
                object[key] = [];
                this.create_interface(value, object[key]);
            } else if(util.isObject(value)) {
                object[key] = {};
                this.create_interface(value, object[key]);
            } else {
                object.__defineSetter__(key, v => this.set(value, v));
                object.__defineGetter__(key, () => { this.get(value); });
            }
        });
    }
};

module.exports = BaseController;
