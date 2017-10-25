const BaseData = require('./base.data.js');
const Role = require('../models/role.model.js');

class Roles extends BaseData {
    constructor( db ) {
        super(db, Role, Role);
    }
}
module.exports = Roles;
