/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import data from 'data';

const $menu = $('#menu');


const setActiveLink = (linkName) => {
    $menu
        .children()
        .each( (index, item) => {
            const link = $($(item).find('a').eq(0));
            if (link.text()===linkName) {
                link.addClass('isActive');
            } else {
                link.removeClass('isActive');
            }
        });
};

const setPrivateLinks = ( role, router ) => {
    if (!role) {
        $('[data-privacy]').remove();
        return true;
    }
    return data.getCourses()
        .then( (courses) => {
            return loadTemplate( `partials/menus/${role}.menu`, { courses });
        })
        .then((template) => {
            $menu.html( $menu.html() + template);
            router.updatePageLinks();
        });
};

module.exports = {
    setActiveLink,
    setPrivateLinks,
 };
