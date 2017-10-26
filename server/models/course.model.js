const Validator = require( '../utils/validator' );
const BaseModel = require('./base.model');

class Course extends BaseModel {
    static isValid(model) {
        return true;
    }
}

module.exports = Course;
