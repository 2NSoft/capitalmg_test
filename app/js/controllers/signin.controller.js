/* globals $ */

import { load as loadTemplate } from 'templates';
import user from 'user';
import { setActiveLink } from 'navUtils';

const $appContainer = $('#app-container');

const formSubmit = (ev) => {
    ev.preventDefault();
    user.signIn( {
        username: $('#sign-in-username').val(),
        password: $('#sign-in-password').val(),
    })
    .catch( () => {
        $('#sign-in-password').val('');
    } );
};

export function get(router) {
    return loadTemplate( 'pages/signin' )
        .then( ( signinTemplate ) => {
            $appContainer.html(signinTemplate);
            setActiveLink('');
            $('form').submit( formSubmit );
            $('#sign-in-register').click( (ev) => {
                ev.preventDefault();
                router.navigate('/register');
            });
        });
}
