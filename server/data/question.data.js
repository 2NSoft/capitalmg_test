const BaseData = require('./base.data.js');
const Question = require('../models/question.model.js');

class Questions extends BaseData {
    constructor( db ) {
        super(db, Question, Question);
    }
}
module.exports = Questions;
