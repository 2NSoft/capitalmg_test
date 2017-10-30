/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import data from 'data';

const $menu = $('#menu');


const setActiveLink = (linkName) => {
    $menu
        .children()
        .each((index, item) => {
            const link = $($(item).find('a').eq(0));
            if (link.text() === linkName) {
                link.addClass('isActive');
            } else {
                link.removeClass('isActive');
            }
        });
};

const setPrivateLinks = (role, router) => {
    if (!role) {
        $('[data-privacy]').remove();
        return true;
    }
    if (role === 'docsecretary') {
        return Promise.all([
            data.getCourses(),
            data.getExams(),
        ])
            .then(([courses, exams]) => {
                return loadTemplate(`partials/menus/${role}.menu`,
                    { courses, exams });
            })
            .then((template) => {
                $menu.html($menu.html() + template);
                router.updatePageLinks();
            });
    }
    if (role === 'docassistant') {
        return data.getCurrentExams()
            .then((exams) => {
                return loadTemplate(`partials/menus/${role}.menu`,
                    { exams });
            })
            .then((template) => {
                $menu.html($menu.html() + template);
                router.updatePageLinks();
            });
    }
    return loadTemplate(`partials/menus/${role}.menu`)
        .then((template) => {
            $menu.html($menu.html() + template);
            router.updatePageLinks();
        });
};

module.exports = {
    setActiveLink,
    setPrivateLinks,
};
