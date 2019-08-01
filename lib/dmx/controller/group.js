const util = require('util');
const bbb = require('bit-by-bit');;
const { osc, functional } = bbb;
const address = require('../address.js');

const utility = require('./utility.js');
const Pack = utility.Pack;

const privatespace = bbb.capsulater();

class Group {
    static create(name, blueprint, controllers) {
        return new Group(name, blueprint, controllers);
    }

    constructor(name, blueprint, controllers) {
        privatespace.create(this, {
            name, blueprint, controllers, registeredOsc: []
        });

        this.extend();
    }

    get name() { return privatespace.get(this).name; }
    get blueprint() { return privatespace.get(this).blueprint; }
    get controllers() { return privatespace.get(this).controllers; }

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

Group.Pack = Pack;

module.exports = Group;
