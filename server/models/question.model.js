const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Question extends BaseModel {
    static isValid(model) {
        if ( !Validator.validateRole( model ) ) {
            return false;
        }
        return true;
    }
}

module.exports = Question;
