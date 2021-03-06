/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');
let $name;
let $docent;
let $submit;
let $select;

const formSubmit = (ev) => {
    ev.preventDefault();
    const courseInfo = {
        name: $name.val(),
        docents: $docent.val(),
    };
    data.addCourse( courseInfo )
        .then( (message) => {
            toastr.success( message );
            $name.val('');
            $docent.val('');
        })
        .catch( (err) => {
            toastr.error( err, 'Could not create course!');
        });
};

const onSelected = (ev) => {
    ev.preventDefault();
    $submit.enable();
};

export function get(router) {
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'administrator') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getCourseCreateData();
        })
        .then(([docents]) => {
            return loadTemplate('pages/course.create', { docents });
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Course');

            $name = $('#course-name');
            $docent = $('#course-docent');
            $submit = $('#course-btn-submit');
            $submit.disable();
            $select = $('#course-docent');

            $select.on('input', onSelected );
            $('form').submit(formSubmit);
        });
}
