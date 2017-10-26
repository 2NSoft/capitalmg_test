const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Administrator extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = Administrator;
