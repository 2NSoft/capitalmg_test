/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');

let examId;
let examSlot;

const onClick = (ev) => {
    const $this = $(ev.target);
    if (!$this.hasClass('btn-checkin')) {
        return true;
    }
    data.checkinStudent( examId, examSlot, $this.attr('data-student') )
        .then( (examinerId) => {
            $this
                .hide(100)
                .removeClass( 'btn-success' )
                .removeClass( 'btn-checkin' )
                .text( `Examiner #${examinerId}` )
                .disable()
                .show(100);
        })
        .catch( (err) => {
            toastr.error( err, 'Something went wrong!');
        });
    return true;
};


export function get(params, router) {
    examId = params.id;
    examSlot = params.slot;
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'docassistant') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getExamCheckInData(examId, examSlot);
        })
        .then(([students]) => {
            return loadTemplate('pages/exam.checkin', { students } );
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $('main').on( 'click', onClick );
        });
}
