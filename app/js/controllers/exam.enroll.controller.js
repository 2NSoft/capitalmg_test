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
let $timeSlot;
let examId;

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
    const slot = $timeSlot.val();
    selected.forEach((student) => {
        const $current = $(`option[value=${student}]`);
        $current
            .prop('selected', false);
        insertNode($current, $enrolled);
        students.push( student );
    });
    data.enrollStudents( { examId, students, slot })
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
    const slot = $timeSlot.val();
    selected.forEach((student) => {
        const $current = $(`option[value=${student}]`);
        $current
            .prop('selected', false);
        insertNode($current, $available);
        students.push( student );
    });
    data.removeStudents( { examId, students, slot })
    .then( () => {
    })
    .catch( () => {
        toastr.error( `Could not enroll!` );
        get();
    });
};

const fillOptions = ( options, $select ) => {
    $select.children().remove();
    options.forEach( (option) => {
        $('<option>')
            .prop( 'value', option.id )
            .text( `#${option.id} - ${option.name}`)
            .appendTo( $select );
    });
};

const onTimeSlotChange = () => {
    const slot = $timeSlot.val();
    data.getEnrolled( examId, slot )
        .then( ({ available, enrolled }) => {
            fillOptions( available, $available );
            fillOptions( enrolled, $enrolled );
        });
    onSelectInput();
};

let router;

export function get(params, _router) {
    if (_router) {
        router = _router;
    }
    examId = params.id;
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'docsecretary') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getExamEnrollData(examId);
        })
        .then(([examSlots]) => {
            return loadTemplate('pages/exam.enroll', examSlots );
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $enroll = $('#exam-enroll-btn-enroll')
                .disable();
            $remove = $('#exam-enroll-btn-remove')
                .disable();
            $enrolled = $('#exam-enroll-enrolled');
            $available = $('#exam-enroll-available');
            $timeSlot = $('#exam-enroll-timeslot');

            $enrolled.on( 'input', onSelectInput );
            $available.on( 'input', onSelectInput );

            $timeSlot.on( 'change', onTimeSlotChange );
            onTimeSlotChange();
            $enroll.on('click', enrollStudents );
            $remove.on('click', removeStudents );

            $('form').submit( (ev) => ev.preventDefault ); // disable submit
        });
}
