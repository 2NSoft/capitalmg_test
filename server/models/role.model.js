const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Role extends BaseModel {
    static isValid(model) {
        if ( !Validator.validateRole( model ) ) {
            return false;
        }
        return true;
    }
}

module.exports = Role;
