const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class QuestionType extends BaseModel {
    static isValid(model) {
        if ( !Validator.validateRole( model ) ) {
            return false;
        }
        return true;
    }
}

module.exports = QuestionType;
