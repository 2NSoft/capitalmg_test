const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Exam extends BaseModel {
    static isValid(model) {
        if ( !Validator.validateRole( model ) ) {
            return false;
        }
        return true;
    }
}

module.exports = Exam;
