/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');
let pageNum;
let examiner;
let $question;
let router;

/* eslint-disable no-invalid-this */
function dragDrop(ev, ui) {
    const $dragged = $(ui.draggable);
    const $this = $(this);
    const buf = $this.text();
    $this.text($dragged.text());
    $dragged.text(buf);
}
/* eslint-enable no-invalid-this */

const loadQuestion = (number) => {
    data.getQuestion(examiner.id, number)
        .then((questionModel) => {
            if (number) {
                questionModel.previous = true;
            }
            return loadTemplate('partials/question', questionModel);
        })
        .then((partial) => {
            $question
                .html(partial)
                .show(200);
            $('.answer')
                .draggable({
                    helper: 'clone',
                });
            $('.answer').droppable({
                accept: '.answer',
                drop: dragDrop,
            });
            $('form').submit((evnt) => evnt.preventDefault()); // disable submit
            $('#answer-btn-previous')
                    .on('click', onPreviousQuestion);
            if (number!==examiner.pageNum-1) {
                $('#answer-btn-submit').on('click', onSubmitQuestion);
            } else {
                $('#answer-btn-submit')
                    .removeClass('btn-success')
                    .addClass('btn-primary')
                    .text('Finish exam')
                    .on('click', onFinishExam);
            }
        });
};

const onSubmitQuestion = (ev) => {
    ev.preventDefault();
    pageNum += 1;
    loadQuestion( pageNum );
};

const onPreviousQuestion = (ev) => {
    ev.preventDefault();
    pageNum -= 1;
    loadQuestion( pageNum );
};

const onFinishExam = (ev) => {
    ev.preventDefault();
    router.navigate( '/student/exams' );
};


export function get(params, _router) {
    if (_router) {
        router=_router;
    }
    const examinerId = params.id;
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'student') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getExaminerData(examinerId);
        })
        .then(([_examiner]) => {
            examiner = _examiner;
            return loadTemplate('pages/examiner', examiner);
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $question = $('#question-container');
            pageNum = 0;
            loadQuestion( pageNum );
        })
        .catch((err) => console.log(err));
}
