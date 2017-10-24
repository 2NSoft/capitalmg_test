const Validator = require( '../utils/validator' );

class User {
    static isValid(model) {
        if ( !Validator.validateUser( model ) ) {
            return false;
        }
        return true;
    }

    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new User();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });
        return viewModel;
    }
}

module.exports = User;
