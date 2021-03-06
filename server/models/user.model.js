const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class User extends BaseModel {
    static isValid(model) {
        if ( !Validator.validateUser( model ) ) {
            return false;
        }
        return true;
    }
}

module.exports = User;
