const util = require('util');
const { osc, functional } = require('bit-by-bit');

const BaseController = require('./base_controller.js');
const utility = require('./utility.js');

class ControllerUnit {
    static create(name, blueprint, addresses, default_buffer, opt = {}) {
        return new ControllerUnit(name, blueprint, addresses, default_buffer, opt);
    }

    constructor(name, blueprint, addresses, default_buffer, opt = {}) {
        this.private = {
            name,
            addresses,
            buffer: default_buffer,
            blueprint,
            registered_osc: [],
            controllers: {}
        };

        for(const key in this.addresses) {
            const address = this.addresses[key];
            const setting = {};
            if(util.isObject(address)) {
                setting.address = address.address;
                setting.buffer = address.buffer || this.buffer;
                setting.opt = address.opt || opt;
            } else {
                setting.address = address;
                setting.buffer = this.buffer;
                setting.opt = opt;
            }
            this.controllers[key] = BaseController.create(
                `${name}/${key}`,
                this.blueprint,
                setting.address,
                setting.buffer,
                setting.opt
            );
        }

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
                    this.registeredOsc.push(pair.osc);
                    if(util.isFunction(pair.dmx)) {
                        osc.subscribe(port, pair.osc, ([address, ...values]) => {
                            functional.object.forEach(this.controllers, (controller) => {
                                pair.dmx(values, controller.buffer, controller.address - 2);
                            });
                        });
                    } else {
                        osc.subscribe(port, pair.osc, ([address, ...values]) => {
                            this.set(pair.dmx, values[0]);
                        });
                    }
                });
            });
        }
        functional.object.forEach(this.controllers, (child) => {
            this.registeredOsc.push(...child.registeredOsc);
        });
        this.extend();
    }

    get controllers() { return this.private.controllers; }

    get name() { return this.private.name; }
    get blueprint() { return this.private.blueprint; }
    get model() { return this.blueprint.model; }
    get modelName() { return this.blueprint.config.model_name; }
    get addresses() { return this.private.addresses; }
    get dmxAddresses() { return this.private.addresses; }
    get length() { return this.blueprint.config.dmx_length; }
    get dmxLength() { return this.length; }
    get ledLength() { return this.model.config.led_length; }
    get buffer() { return this.private.buffer; }
    get status() {
        return functional.object.map(this.controllers, child => child.status);
    }
    toString() {
        return `${this.name} [${this.modelName}]\n[\n`
            + functional.object.reduce(this.controllers, (reduced, child, key) => reduced + `  ${key}: ${child.information}\n`, '' ) + ']';
    }
    get information() { return this.toString(); }
    get registeredOsc() { return this.private.registered_osc; }

    set(n, value) {
        return functional.object.map(this.controllers, (controller, key) => controller.set(n, value));
    }
    get(n) {
        return functional.object.map(this.controllers, (controller, key) => controller.get(n));
    }
    extend() {
        for(const key in this.addresses) {
            this.__defineGetter__(key, () => this.controllers[key]);
        }
        this.create_interface(this.model, this);
    }

    create_interface(blueprint, object) {
        Object.keys(blueprint).forEach(key => {
            const value = blueprint[key];
            if(util.isFunction(value)) {
                object.__defineSetter__(key, (...v) => {
                    functional.object.map(this.controllers, (controller) => {
                        return value(v, controller.buffer, controller.address)
                    });
                });
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

    forEach(callback) {
        return functional.object.forEach(this.controllers, callback);
    }
    map(callback) {
        return functional.object.map(this.controllers, callback);
    }
}

module.exports = ControllerUnit;