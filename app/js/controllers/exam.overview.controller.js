/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');
let router;

const toggleExams = (ev) => {
    ev.preventDefault();
    const $this = $(ev.target);
    if ($this.text()==='Preview') {
        $this.text( 'Hide' );
        $this
            .parent()
            .siblings('.course-exams-container')
            .show(200);
    } else {
        $this.text( 'Preview' );
        $this
            .parent()
            .siblings('.course-exams-container')
            .hide(200);
    }
};

const startExam = (ev) => {
    ev.preventDefault();
    const id = $(ev.target).attr('data-examiner');
    router.navigate(`/student/examiner/${id}`);
};

export function get(_router) {
    if (_router) {
        router = _router;
    }
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'student') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getExamOverviewData( currUser.id );
        })
        .then(([exams]) => {
            return loadTemplate('pages/exam.overview', exams );
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $('.btn-preview').on('click', toggleExams );
            $('.btn-start').on('click', startExam );
        })
        .catch((err)=>console.log(err));
}
