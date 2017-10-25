/* globals $ */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';

const $appContainer = $('#app-container');

export function get(router) {
    return loadTemplate( 'pages/home' )
        .then( ( homeTemplate ) => {
            $appContainer.html(homeTemplate);
            setActiveLink( 'Home' );
        });
}
