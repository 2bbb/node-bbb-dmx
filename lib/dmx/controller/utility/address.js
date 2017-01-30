const {functional} = require('bit-by-bit');
const address = require('../../address.js');

const getRanges = (controllers) => functional.flatten(controllers.map(controller => controller.dmxAddressRange));
const calculateMap = (...controllers) => address.calculateMap(...getRanges(controllers));
const printFreeAddress = (...controllers) => address.printFreeAddress(...getRanges(controllers));
const calclateFreeAddressNum = (...controllers) => address.calclateFreeAddressNum(...getRanges(controllers));
const checkConflict = (...controllers) => address.checkConflict(...getRanges(controllers));

module.exports = {
    calculateMap,
    printFreeAddress,
    calclateFreeAddressNum,
    checkConflict,
};
