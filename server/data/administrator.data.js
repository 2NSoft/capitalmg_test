const BaseData = require('./base.data.js');
const Administrator = require('../models/administrator.model.js');

class Administrators extends BaseData {
    constructor( db ) {
        super(db, Administrator, Administrator);
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
module.exports = Administrators;
