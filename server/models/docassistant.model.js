const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class DocAssistant extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = DocAssistant;
