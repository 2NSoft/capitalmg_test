/* globals $ toastr moment */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';
import Handlebars from 'handlebars';

const $appContainer = $('#app-container');
let examModel;
let $dateFrom;
let $dateTo;
let $course;
let $addSlot;
let $removeSlot;
let $slots;
let $questionsContainer;
let $submit;
let $revert;
let $continue;
let $create;
let $questions;
let $questionsNumber;
let $warning;
let startDate;
let endDate;
let questionTemplate;

const setUpDatePickers = () => {
    const icons = {
        time: 'glyphicon glyphicon-time',
        date: 'glyphicon glyphicon-calendar',
        up: 'glyphicon glyphicon-triangle-top',
        down: 'glyphicon glyphicon-triangle-bottom',
        left: 'glyphicon glyphicon-triangle-left',
        right: 'glyphicon glyphicon-triangle-right',
    };
    $dateFrom.datetimepicker({
        icons,
    });
    $dateTo.datetimepicker({
        icons,
        useCurrent: false,
    });
    $dateFrom.on('dp.change', function(e) {
        $dateTo.data('DateTimePicker').minDate(e.date);
        if ($dateFrom.data('DateTimePicker').date()) {
            startDate = $dateFrom.data('DateTimePicker').date()._d;
        } else {
            startDate = null;
        }
        checkAddState();
    });
    $dateTo.on('dp.change', function(e) {
        $dateFrom.data('DateTimePicker').maxDate(e.date);
        if ($dateTo.data('DateTimePicker').date()) {
            endDate = $dateTo.data('DateTimePicker').date()._d;
        } else {
            endDate = null;
        }
        checkAddState();
    });
};

const checkAddState = () => {
    if (startDate && endDate) {
        $addSlot.enable();
    } else {
        $addSlot.disable();
    }
};

const onAddSlot = (ev) => {
    ev.preventDefault();
    examModel.timeSlots = examModel.timeSlots || [];
    examModel.timeSlots.push({
        startDate,
        endDate,
    });
    const display =
        `From ${moment(startDate).format('D.MMM.Y HH:mm')} to ` +
        `${moment(endDate).format('D.MMM.Y HH:mm')}`;
    $('<option/>')
        .val(examModel.timeSlots.length-1)
        .text(display)
        .appendTo($slots);
    $dateFrom.data('DateTimePicker').clear();
    $dateTo.data('DateTimePicker').clear();
    $continue.enable();
};

const onRemoveSlot = (ev) => {
    ev.preventDefault();
    const selected = $slots.val();
    examModel.timeSlots =
        examModel.timeSlots
            .filter( (slot, index) => {
                return selected.find( (idx) => idx === index +'' );
            });
    selected
        .forEach( (slot) => {
            $slots.children(`option[value=${slot}]`).remove();
        });
    $removeSlot.disable();
    if ($slots.children().length) {
        $continue.enable();
    } else {
        $continue.disable();
    }
};

const onSlotInput = () => {
    if ($slots.val().length) {
        $removeSlot.enable();
    } else {
        $removeSlot.disable();
    }
};

const onContinue = (ev) => {
    ev.preventDefault();
    examModel.questionsNumber = $questionsNumber.val();
    examModel.course = {
        id: $course.val(),
        name: $(`option[value=${$course.val()}]`).text(),
    };
    $create
        .disable()
        .hide(200);
    data.getCourseQuestionsPreview(examModel.course.id)
        .then( (questions) => {
            questions = questions.map( (question) => {
                question.model.nosubmit = true;
                question.preview = questionTemplate(question.model);
                delete question.model;
                return question;
            });
            return loadTemplate( 'partials/questions.preview', { questions } );
        })
        .then( (template) => {
            $questionsContainer
                .html(template);
            $questions
                .show(200);
            $questions.on( 'click', previewClick );
            $('.question-preview input')
                .prop('disabled', true );
            $('.exam-question-checkbox')
                .on( 'change', onQuestionSelect );
            $('.question-preview textarea')
                .prop('disabled', true );
            setSubmitState();

            $('form').submit((evnt) =>
                evnt.preventDefault()); // disable submit            
        });
};

const setSubmitState = () => {
    examModel.questions = examModel.questions || [];
    const diff = examModel.questionsNumber - examModel.questions.length;
    if ( diff > 0 ) {
        $warning.text(`Choose at least ${diff} more questions`);
        $submit.removeClass('btn-success');
        $submit.addClass('btn-danger');
        $submit.disable();
    } else {
        $warning.text('Submit');
        $submit.addClass('btn-success');
        $submit.removeClass('btn-danger');
        $submit.enable();
    }
};

const onQuestionSelect = (ev) => {
    const $this = $(ev.target);
    const questionID = $this.val();
    if ( $this.prop('checked') ) {
        examModel.questions.push( questionID );
    } else {
        examModel.questions =
            examModel.questions.filter((id)=>id!==questionID);
    }
    setSubmitState();
};

const previewClick = (ev) => {
    const $this = $(ev.target);
    if (!$this.hasClass('btn-preview')) {
        return;
    }
    ev.preventDefault();
    if ($this.text() === 'Preview') {
        $this.text('Hide');
        $this
            .parents('.question-preview-container')
            .children('.question-preview')
            .show(200);
        return;
    }
    $this.text('Preview');
    $this
        .parents('.question-preview-container')
        .children('.question-preview')
        .hide(200);
    return;
};

const onRevertExam = (ev) => {
    ev.preventDefault();
    $create.show(200);
    $questions.hide(200);
    $questionsContainer.html('');
};

const onSubmit = (ev) => {
    ev.preventDefault();
    data.addExam( examModel )
    .then( () => {
        toastr.success( 'Exam succesfully added!');
        $questions.hide(200);
        $questionsContainer.html('');
        get();
    })
    .catch( (err) => {
        toastr.error( err, 'Something went wrong!');
    });
};

let router;

export function get(_router) {
    if (_router) {
        router = _router;
    }
    examModel = {};
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'docent') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getExamCreateData();
        })
        .then(([courses, template]) => {
            questionTemplate = Handlebars.compile(template);
            return loadTemplate('pages/exam.create',
                { courses });
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $dateFrom = $('#exam-date-from');
            $dateTo = $('#exam-date-to');
            $questionsNumber = $('#exam-questions-number');
            $course = $('#exam-course');
            $addSlot = $('#exam-btn-add-slot')
                .disable();
            $removeSlot = $('#exam-btn-remove-slot')
                .disable();
            $slots = $('#exam-timeslots');
            $continue = $('#exam-btn-continue')
                .disable();
            $create = $('#exam-create');
            $questions = $('#exam-questions');
            $questionsContainer = $('#exam-questions-container');
            $submit = $('#exam-btn-submit');
            $revert = $('#exam-btn-revert');
            $warning = $('#exam-warning');

            $addSlot.on('click', onAddSlot);
            $removeSlot.on('click', onRemoveSlot);
            $continue.on( 'click', onContinue );
            $slots.on('input', onSlotInput);
            $submit.on('click', onSubmit);
            $revert.on( 'click', onRevertExam );

            $('form').submit((ev) => ev.preventDefault()); // disable submit

            setUpDatePickers();
        });
}
