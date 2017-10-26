const BaseData = require('./base.data.js');
const DocAssistant = require('../models/docassistant.model.js');

class DocAssistants extends BaseData {
    constructor( db ) {
        super(db, DocAssistant, DocAssistant);
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
module.exports = DocAssistants;
