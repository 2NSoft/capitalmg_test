const passport = require('passport');
const { Strategy } = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const configPassport = (app, data) => {
    passport.use( new Strategy(
        ( username, password, done ) => {
            return data.users.findUser( username )
                .then( ( user ) => {
                    if ( !user ) {
                        return done( null, false,
                            { message: 'Incorrect username.' } );
                    }
                    if ( !data.users.validatePassword( user, password ) ) {
                        return done( null, false,
                            { message: 'Incorrect password.' } );
                    }
                    return done( null, user );
                } )
                .catch( ( err ) => {
                    return done( err );
                } );
        }
    ) );
    app.use( cookieParser() );
    app.use( session( {
        secret: 'Deus ex machina',
        maxAge: new Date( Date.now() + 60 * 60 * 1000 ),
        store: new MongoStore(
            { url: data.sessionStoreName },
            ( err ) => {
                console.log( err || 'connect-mongodb setup ok' );
            } ),
    } ) );

    app.use( passport.initialize() );
    app.use( passport.session() );

    passport.serializeUser( ( user, done ) => {
        done( null, user.id );
    } );

    passport.deserializeUser( ( id, done ) => {
        return data.users.findById( id )
            .then( ( user ) => {
                done( null, user );
            } )
            .catch( done );
    } );
    console.log( 'passport initialized' );
};

module.exports = configPassport;
