const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Student extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = Student;
