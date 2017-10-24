/* globals $ toastr*/

import { load as loadTemplate } from 'templates';
import user from 'user';

const $appContainer = $('#app-container');

export function get(params) {
    return loadTemplate( 'pages/register' )
        .then( ( registerTemplate ) => {
            $appContainer.html(registerTemplate);
            $('form').submit( (ev) => {
                ev.preventDefault();
                const registerInfo = {
                    firstname: $('#register-firstname').val(),
                    lastname: $('#register-lastname').val(),
                    username: $('#register-username').val(),
                    email: $('#register-email').val(),
                    password: $('#register-password').val(),
                    repeat: $('#register-repeat').val(),
                };
                if (registerInfo.password !== registerInfo.repeat) {
                    toastr.error('Passwords do not match!');
                    return;
                }
                user.register( registerInfo );
            });
        });
}
