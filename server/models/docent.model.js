const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Docent extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = Docent;
