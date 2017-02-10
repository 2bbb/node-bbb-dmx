const { functional } = require('bit-by-bit');

class Pack {
    static apply(hash, callback) {
        return new Pack(functional.object.map(hash, callback));
    }
    constructor(hash) {
        this.body = hash;
    }
    apply(callback) {
        return new Pack(functional.object.map(this.body, callback));
    }
};

module.exports = Pack;