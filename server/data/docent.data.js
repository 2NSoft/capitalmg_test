const BaseData = require('./base.data.js');
const Docent = require('../models/docent.model.js');

class Docents extends BaseData {
    constructor( db ) {
        super(db, Docent, Docent);
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
module.exports = Docents;
