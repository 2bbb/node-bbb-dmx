const utility = require('./controller/utility.js');
const BaseController = require('./controller/base_controller.js');
const ControllerUnit = require('./controller/controller_unit.js');
const Group = require('./controller/group.js');

module.exports = {
    create: BaseController.create,
    createUnit: ControllerUnit.create,
    createGroup: Group.create,
    utility
};