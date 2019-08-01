class Addresses {
    constructor(...addresses) {
        this.addresses = addresses;
    }
    set(value, buffer, address, controller) {
        addresses.map(offset => (buffer[address + offset - 2] = value));
    }
};

module.exports = Adresses;
