const util = require('util');
const {osc} = require('bit-by-bit');
const utility = require('./utility.js');
const address = require('../address.js');

class BaseController {
    static create(name, blueprint, address, buffer, opt = {}) {
        return new BaseController(name, blueprint, address, buffer, opt);
    }
    constructor(name, blueprint, address, buffer, opt = {}) {
        this.private = {
            name,
            address,
            buffer,
            blueprint,
            registered_osc: []
        };

        let { osc_port } = opt;

        if(osc_port) {
            if(!util.isArray(osc_port)) osc_port = [osc_port];
            const pairs = utility.osc.get_address_pair(this.model)
                .map(({osc, dmx}) => ({
                    osc: util.format("/%s%s", this.name, osc),
                    dmx
                }));
            osc_port.forEach(port => {
                pairs.forEach(pair => {
                    this.registeredOsc.push(pair.osc);
                    if(util.isFunction(pair.dmx)) {
                        osc.subscribe(port, pair.osc, ([address, ...values]) => {
                            pair.dmx(values, this.buffer, this.address - 2, this);
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
        if(this.blueprint.config.initialize) this.blueprint.config.initialize(this);
    }

    get name() { return this.private.name; }
    get blueprint() { return this.private.blueprint; }
    get model() { return this.blueprint.model; }
    get manufacturer() { return this.blurprint.config.manufacturer || 'Unknown Manufacturer'; }
    get modelName() { return this.blueprint.config.model_name || 'Unknown Model'; }
    get address() { return this.private.address; }
    get dmxAddress() { return this.private.address; }
    get dmxAddressRange() {
        return new address.Range(this.dmxAddress, this.dmxAddress + this.dmxLength - 1);
    }
    get offset() { return this.private.address - 1; }
    get length() { return this.blueprint.config.dmx_length; }
    get dmxLength() { return this.length; }
    get ledLength() { return this.blueprint.config.led_length; }
    get buffer() { return this.private.buffer; }
    get status() { return this.buffer.slice(this.offset, this.offset + this.length); }
    toString() { return `${this.name} [${this.modelName}] @ ch: ${this.address} - ${this.address + this.dmxLength - 1}`; }
    get information() { return this.toString(); }
    get registeredOsc() { return this.private.registered_osc; }

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
                Object.defineProperty(object, key, {
                    get: () => (...v) => value(v, this.buffer, this.address - 2, this),
                    set: (v) => value(v, this.buffer, this.address - 2, this),
                });
            } else if(util.isArray(value)) {
                const arr = [];
                this.create_interface(value, arr);
                if(value.hasOwnProperty('set')) {
                    Object.defineProperty(object, key, {
                        get: () => arr,
                        set: (v) => value.set(v, this.buffer, this.address - 2, this)
                    });
                } else {
                    Object.defineProperty(object, key, { get: () => arr });
                }
            } else if(util.isObject(value)) {
                const obj = {};
                this.create_interface(value, obj);
                if(value.hasOwnProperty('set')) {
                    Object.defineProperty(object, key, {
                        get: () => obj,
                        set: (v) => value.set(v, this.buffer, this.address - 2, this)
                    });
                } else {
                    Object.defineProperty(object, key, { get: () => obj });
                }
            } else {
                Object.defineProperty(object, key, {
                    get: () => this.get(value),
                    set: v => this.set(value, v),
                });
            }
        });
    }
};

module.exports = BaseController;
