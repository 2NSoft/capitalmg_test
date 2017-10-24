/* eslint-disable no-undefined*/
class Validator {
    static default() {
        return {
            MIN_LENGTH: 3,
            MAX_LENGTH: 100,
            CATEGORIES: ['restaurants', 'bars', 'clubs'],
        };
    }


    static stringLength( s, min, max ) {
        if ( min === undefined ) {
            min = Validator.default().MIN_LENGTH;
        }
        if ( max === undefined ) {
            max = Validator.default().MAX_LENGTH;
        }
        if ( !s ) {
            if ( min === 0 ) {
                return true;
            }
            return false;
        }
        return ( min <= s.length ) && ( s.length <= max );
    }

    static password( password ) {
        const numbers = password.match( /[0-9]/g ) || [];
        return Validator.stringLength( password, 6, 100 ) &&
            (numbers.length > 0);
    }

    static email( email ) {
        const template = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line max-len
        return template.test( email );
    }

    static id( id ) {
        return Validator.stringLength( '' + id, 24, 24 );
    }

    // <-----user validations----->
    static username( username ) {
        return Validator.stringLength( username );
    }

    static name( name ) {
        return Validator.stringLength( name );
    }

    static validateUser( {
        firstname, lastname, username,
        email, password, nationality } ) {
        return Validator.username( username ) &&
            Validator.name( firstname ) &&
            Validator.name( lastname ) &&
            Validator.password( password ) &&
            Validator.email( email );
    }
}

module.exports = Validator;
