const BaseData = require('./base.data.js');
const Exam = require('../models/exam.model.js');

class Exams extends BaseData {
    constructor( db ) {
        super(db, Exam, Exam);
    }
}
module.exports = Exams;
