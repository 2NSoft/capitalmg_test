/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const questionTypes = [
    'Multiple choice',
    'Multy select',
    'Open question',
    'Ranking',
];

const $appContainer = $('#app-container');

export function get(router) {
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'docent') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return loadTemplate('pages/exam.questions', { questionTypes } );
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');
        });
}
