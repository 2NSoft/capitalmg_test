/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');

let $course;
let $type;
let questionModel;
let stages;
let $continue;
let $revert;
let $review;
let $placeholder;
let $title;
let $questionTitle;
let $option;
let $preview;
let $create;

const $questionOptions = [];

const createIdNamePair = (select) => {
    const id = select.val();
    const optionSelector = `[value=${id}]`;
    const name = select.children(optionSelector).text();
    return { id, name };
};

const createModel = () => {
    const result = {
        course: createIdNamePair($course),
        type: createIdNamePair($type),
    };
    if ($title) {
        result.title = $title.val().replace(/\n/g, '<br>');
    }
    result.options = [];
    $('.option')
        .each((index, option) => {
            result.options.push($(option).val().replace(/\n/g, '<br>'));
        });
    if ($preview) {
        const $form = $preview.children('form');
        result.correctAnswers = [];
        switch (result.type.name) {
            case 'Multiple choice': {
                result.correctAnswers
                    .push(result
                        .options[$('input[name=answer]:checked')
                        .val()]);
                break;
            }
            case 'Multy select': {
                $('input[type=checkbox]:checked')
                    .each((index, option) => {
                        result.correctAnswers
                            .push(result.options[$(option).val()]);
                    });
                break;
            }
            case 'Open question': {
                break;
            }
            case 'Ranking': {
                $('.answer')
                    .each((index, option) => {
                        result.correctAnswers
                            .push($(option).text());
                    });
                break;
            }
            default: break;
        }
        result.score = $('#question-score').val();
    }
    return result;
};

const onInput = (ev) => {
    let enabled = true;
    $('.option')
        .each((index, element) => {
            enabled = enabled && $(element).val() !== '';
        });
    $review.prop('disabled', !enabled);
    $continue.prop('disabled', !enabled);
};

const onRevert = (ev) => {
    ev.preventDefault();
    stages.pop();
    switch (stages.length) {
        case 0: {
            $review.hide(0);
            $revert.hide();
            $continue
                .show(0)
                .enable()
                .addClass('pull-right');
            $questionTitle.remove();
            $course.enable();
            $type.enable();
            break;
        }
        /* eslint-disable no-fallthrough, no-lone-blocks*/
        case 1: {
            $continue.text('Continue');
            $continue.enable();
            $review.hide(0);
            $title
                .enable()
                .focus();
        }
        default: {
            $questionOptions
                .pop()
                .remove();
            questionModel = createModel();
            const id = questionModel.options.length;
            if (id > 0) {
                $option = $(`#question-option-text-${id}`);
                $option.focus();
                $review.enable();
                $continue.enable();
            }
            break;
        }
        /* eslint-enable no-fallthrough no-lone-blocks*/
    }
};

const onContinue = (ev) => {
    ev.preventDefault();
    questionModel = createModel();
    stages.push(questionModel);
    switch (stages.length) {
        case 1: {
            $course.disable();
            $type.disable();
            loadTemplate('partials/question.title')
                .then((partial) => {
                    $questionTitle = $(partial);
                    $questionTitle
                        .insertBefore($placeholder)
                        .show(200);
                    $title = $('#question-title');
                    $title.on('input', onInput);
                    $title.focus();
                });
            $revert.show(0);
            if (questionModel.type.name === 'Open question') {
                $review
                    .show(0)
                    .disable();
                $continue.hide(0);
                break;
            }
            $continue
                .disable()
                .removeClass('pull-right');
            break;
        }
        /* eslint-disable no-fallthrough, no-lone-blocks*/
        case 2: {
            $continue.text('Next option');
            $review.show(0);
            $title.disable();
        }
        default: {
            $review.disable();
            $continue.disable();
            const id = questionModel.options.length + 1;
            loadTemplate('partials/question.option', { id })
                .then((partial) => {
                    const $questionOption = $(partial);
                    $questionOption
                        .insertBefore($placeholder)
                        .show(200);
                    $questionOptions.push($questionOption);
                    $option = $(`#question-option-text-${id}`);
                    $option.on('input', onInput);
                    $option.focus();
                });
            break;
        }
        /* eslint-enable no-fallthrough no-lone-blocks*/
    }
};

/* eslint-disable no-invalid-this */
function dragDrop(ev, ui) {
    const $dragged = $(ui.draggable);
    const $this = $(this);
    const buf = $this.text();
    $this.text($dragged.text());
    $dragged.text(buf);
}
/* eslint-enable no-invalid-this */

const onReview = (ev) => {
    ev.preventDefault();

    questionModel = createModel();
    $create.hide(200);

    questionModel.preview = true;
    switch (questionModel.type.name) {
        case 'Multiple choice': {
            questionModel.single = true;
            break;
        }
        case 'Multy select': {
            questionModel.multiple = true;
            break;
        }
        case 'Open question': {
            questionModel.open = true;
            break;
        }
        case 'Ranking': {
            questionModel.ranking = true;
            break;
        }
        default: break;
    }
    loadTemplate('partials/question', questionModel)
        .then((partial) => {
            $preview
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
            $('#answer-btn-revert').on('click', onRevertQuestion);
            $('#answer-btn-submit').on('click', onSubmitQuestion);
        });
};

const onSubmitQuestion = (ev) => {
    ev.preventDefault();
    questionModel = createModel();
    data.addQuestion( questionModel )
        .then( () => {
            toastr.success( 'Question succesfully added!');
            $preview
                .hide(200)
                .html('');
            get();
        })
        .catch( (err) => {
            toastr.error( err, 'Something went wrong!');
        });
};

const onRevertQuestion = (ev) => {
    ev.preventDefault();
    $create.show(200);
    $preview
        .hide(200)
        .html('');
    if ($option) {
        $option.focus();
    }
};
let router;
export function get(_router) {
    if (_router) {
        router = _router;
    }
    questionModel = {};
    stages = [];
    return user.checkStatus()
        .then((currUser) => {
            if (currUser.role !== 'docent') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getQuestionData();
        })
        .then(([courses, questionTypes]) => {
            return loadTemplate('pages/exam.questions',
                { courses, questionTypes });
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Exam');

            $course = $('#question-course');
            $type = $('#question-type');
            $continue = $('#question-btn-continue');
            $revert = $('#question-btn-revert');
            $review = $('#question-btn-review');
            $placeholder = $('#question-insert-placeholder');
            $preview = $('#question-preview');
            $create = $('#question-create');

            $continue.on('click', onContinue);
            $revert.on('click', onRevert);
            $review.on('click', onReview);

            $('form').submit((ev) => ev.preventDefault()); // disable submit
        });
}
