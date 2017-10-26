const BaseData = require('./base.data.js');
const Student = require('../models/student.model.js');

class Students extends BaseData {
    constructor( db ) {
        super(db, Student, Student);
    }

    findByUserId(id) {
        return this.collection.findOne({
            userId: { $eq: id },
        })
            .then((user) => {
                if ( !user ) return user;
                return this.ModelClass.toViewModel(user);
            } );
    }
}
module.exports = Students;
