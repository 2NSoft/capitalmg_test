const BaseData = require('./base.data.js');
const DocSecretary = require('../models/docsecretary.model.js');

class DocSecretarys extends BaseData {
    constructor( db ) {
        super(db, DocSecretary, DocSecretary);
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
module.exports = DocSecretarys;
