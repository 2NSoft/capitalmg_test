/* globals $ */

import { load as loadTemplate } from 'templates';
import user from 'user';

const $appContainer = $('#app-container');

export function get(router) {
    return loadTemplate( 'pages/signin' )
        .then( ( signinTemplate ) => {
            $appContainer.html(signinTemplate);
            $('form').submit( (ev) => {
                ev.preventDefault();
                user.signIn( {
                    username: $('#sign-in-username').val(),
                    password: $('#sign-in-password').val(),
                });
            });
            $('#sign-in-register').click( (ev) => {
                ev.preventDefault();
                router.navigate('/register');
            });
        });
}
