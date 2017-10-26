const BaseData = require('./base.data.js');
const Course = require('../models/course.model.js');

class Courses extends BaseData {
    constructor( db ) {
        super(db, Course, Course);
    }
}

module.exports = Courses;
