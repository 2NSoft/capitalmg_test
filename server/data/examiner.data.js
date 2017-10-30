const BaseData = require('./base.data.js');
const Examiner = require('../models/examiner.model.js');

class Examiners extends BaseData {
    constructor( db ) {
        super(db, Examiner, Examiner);
    }
}
module.exports = Examiners;
