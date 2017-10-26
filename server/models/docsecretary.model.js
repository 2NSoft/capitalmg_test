const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class DocSecretary extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = DocSecretary;
