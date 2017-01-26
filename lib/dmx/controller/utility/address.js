const {functional} = require('bit-by-bit');
const address = require('../../address.js');

const getRanges = (controllers) => {
    return functional.flatten(controllers.map(controller => controller.dmxAddressRange));
}

const calculateMap = (...controllers) => {
    return address.calculateMap(...getRanges(controllers));
};

const printFreeAddress = (...controllers) => {
    return address.printFreeAddress(...getRanges(controllers));
};

const checkConflict = (...controllers) => {
    return address.checkConflict(...getRanges(controllers));
}

module.exports = {
    calculateMap,
    printFreeAddress,
    checkConflict,
};
