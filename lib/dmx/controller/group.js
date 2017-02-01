const util = require('util');
const { osc, functional } = require('bit-by-bit');
const utility = require('./utility.js');
const address = require('../address.js');

class Group {
    static create(name, blueprint, controllers) {
        return new Group(name, blueprint, controllers);
    }

    constructor(name, blueprint, controllers) {
        this.private = {
            name, blueprint, controllers, registeredOsc: []
        };

        this.extend();
    }

    get name() { return this.private.name; }
    get blueprint() { return this.private.blueprint; }
    get controllers() { return this.private.controllers; }

    extend() {
        functional.object.forEach(this.controllers, (controller, key) => {
            Object.defineProperty(this, key, { get: () => controller });
        });
        this.create_interface(this.blueprint, this);
    }

    create_interface(blueprint, object) {
        functional.object.forEach(blueprint, (value, key) => {
            if(util.isFunction(value)) {
                Object.defineProperty(object, key, {
                    get: () => (...v) => functional.object.forEach(this.controllers, (controller) => value(v, controller)),
                    set: (v) => functional.object.forEach(this.controllers, (controller) => value(v, controller)),
                });
            } else if(util.isArray(value)) {
                const arr = [];
                this.create_interface(value, arr);
                if(value.hasOwnProperty('set')) {
                    Object.defineProperty(object, key, {
                        get: () => arr,
                        // set: (v) => functional.object.forEach(this.controllers, controller => { controller[key].set(v); }),
                        set: (v) => arr.set(v),
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
                        // set: (v) => functional.object.forEach(this.controllers, controller => { controller[key].set(v); }),
                        set: (v) => obj.set(v),
                    });
                } else {
                    Object.defineProperty(object, key, { get: () => obj });
                }
            } else {
                Object.defineProperty(object, key, {
                    get: () => functional.object.map(this.controllers, controller => controller[key]),
                    set: (v) => functional.object.forEach(this.controllers, controller => { controller[key] = v; }),
                });
            }
        });
    }
};

module.exports = Group;
