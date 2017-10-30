/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');
let $enroll;
let $enrolled;
let $available;
let $remove;
let courseId;

const onSelectInput = () => {
    $enroll.prop('disabled', !$available.val().length );
    $remove.prop('disabled', !$enrolled.val().length );
};

const insertNode = ($node, $target) => {
    let targetIds = [];
    $target
        .children()
        .each((index, item) => {
            targetIds.push( $(item).val() );
        });
    targetIds.push( $node.val() );
    targetIds = targetIds.sort((a, b) => a.localeCompare(b));
    const index = targetIds.findIndex((id) => id === $node.val() );
    if (index < targetIds.length - 1) {
        $node
            .insertBefore( $target.children().eq(index) );
        return true;
    }
    $node.appendTo($target);
    return true;
};

const enrollStudents = (ev) => {
    ev.preventDefault();
    const selected = $available.val();
    const students = [];
    selected.forEach((student) => {
        const $current = $(`option[value=${student}]`);
        $current
            .prop('selected', false);
        insertNode($current, $enrolled);
        students.push( student );
    });
    data.enrollStudents( { courseId, students })
    .then( () => {
    })
    .catch( () => {
        toastr.error( `Could not enroll!` );
        get();
    });
};

const removeStudents = (ev) => {
    ev.preventDefault();
    const selected = $enrolled.val();
    const students = [];
    selected.forEach((student) => {
        const $current = $(`option[value=${student}]`);
        $current
            .prop('selected', false);
        insertNode($current, $available);
        students.push( student );
    });
    data.removeStudents( { courseId, students })
    .then( () => {
    })
    .catch( () => {
        toastr.error( `Could not enroll!` );
        get();
    });
};

let router;

export function get(params, _router) {
    if (_router) {
        router = _router;
    }
    courseId = params.id;
    return user.checkStatus()
        .then((currUser) => {
            // if (currUser.role !== 'docsecretary') {
            //     router.navigate('/unauthorized');
            //     return Promise.reject('Unauthorized access attempted!');
            // }
            return data.getCourseEnrollData(courseId);
        })
        .then(([students]) => {
            return loadTemplate('pages/course.enroll', students );
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Course');

            $enroll = $('#course-enroll-btn-enroll')
                .disable();
            $remove = $('#course-enroll-btn-remove')
                .disable();
            $enrolled = $('#course-enroll-enrolled');
            $available = $('#course-enroll-available');

            $enrolled.on( 'input', onSelectInput );
            $available.on( 'input', onSelectInput );

            $enroll.on('click', enrollStudents );
            $remove.on('click', removeStudents );

            $('form').submit( (ev) => ev.preventDefault ); // disable submit
        });
}
