const BaseData = require('./base.data.js');
const QuestionType = require('../models/questionType.model.js');

class QuestionTypes extends BaseData {
    constructor( db ) {
        super(db, QuestionType, QuestionType);
    }
}
module.exports = QuestionTypes;
