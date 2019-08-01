const { functional } = require('bit-by-bit');

class Pack {
    static apply(hash, callback) {
        return new Pack(functional.object.map(hash, callback));
    }
    static isPack(value) { return value instanceof Pack; }
    constructor(hash) {
        this.body = hash;
        for(const key in this.body) {
            Object.defineProperty(this, key, {
                get: () => this.body[key],
                set: (v) => (this.body[key] = v)
            });
        }
    }
    apply(callback) {
        return new Pack(functional.object.map(this.body, callback));
    }
};

module.exports = Pack;
