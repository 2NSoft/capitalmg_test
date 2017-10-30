/* globals $ */

$.put = (url, data, type = 'application/json') => {
    return $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: type,
    });
};


const getUserConfirmData = () => {
    return Promise.all([
        $.get('/api/v1/users?notconfirmed=true'),
        $.get('/api/v1/roles'),
    ])
        .then(([users, roles]) => {
            return Promise.resolve({ users, roles });
        });
};

const updateUserRole = (data) => {
    return $.put('/api/v1/users', data);
};

const getDocents = () => {
    return $.get('/api/v1/users?role=docent');
};

const getCourses = () => {
    return $.get('/api/v1/courses');
};

const getExams = () => {
    return $.get('/api/v1/exams');
};

const getCurrentExams = () => {
    return $.get('/api/v1/exams?current=true');
};

const getQuestionTypes = () => {
    return $.get('/api/v1/questions?questiontypes=true');
};

const getCourseCreateData = () => {
    return Promise.all([
        getDocents(),
    ]);
};

const addCourse = (model) => {
    return $.post('/api/v1/courses', model);
};

const addQuestion = (model) => {
    return $.post('/api/v1/questions', model);
};

const addExam = (model) => {
    return $.post('/api/v1/exams', model);
};

const getQuestionCreateData = () => {
    return Promise.all([getCourses(), getQuestionTypes()]);
};

const getExamCreateData = () => {
    return Promise.all([
        getCourses(),
        $.get(`templates/partials/question.handlebars`),
    ]);
};

const getCourseQuestionsPreview = (courseId) => {
    return $.get(`api/v1/questions?course=${courseId}&preview=true`);
};

const getCourseEnrollData = (id) => {
    return Promise.all( [
        $.get(`/api/v1/courses?id=${id}&enrolled=true`),
    ]);
};

const getExamEnrollData = (id) => {
    return Promise.all( [
        $.get(`/api/v1/exams?id=${id}`),
    ]);
};

const enrollStudents = ( model ) => {
    if (model.courseId) {
        const query = `id=${model.courseId}&enroll=true`;
        return $.put( `/api/v1/courses?${query}`, model );
    }
    const query = `id=${model.examId}&enroll=true`;
    return $.put( `/api/v1/exams?${query}`, model );
};

const removeStudents = ( model ) => {
    if (model.courseId) {
        const query = `id=${model.courseId}&remove=true`;
        return $.put( `/api/v1/courses?${query}`, model );
    }
    const query = `id=${model.examId}&remove=true`;
    return $.put( `/api/v1/exams?${query}`, model );
};

const getEnrolled = ( examId, slot ) => {
    return $.get(`/api/v1/exams?id=${examId}&slot=${slot}&enrolled=true`);
};

const getExamCheckInData = ( examId, slot ) => {
    return Promise.all( [
        $.get(`/api/v1/exams?id=${examId}&slot=${slot}&checkedin=true`),
    ]);
};

const checkinStudent = ( examId, slot, student ) => {
    return $.post( '/api/v1/examiners', { examId, slot, student });
};

module.exports = {
    getUserConfirmData,
    getCourseCreateData,
    getExamCreateData,
    getQuestionCreateData,
    getCourseEnrollData,
    getExamEnrollData,
    getExamCheckInData,

    getCourseQuestionsPreview,
    getCourses,
    getExams,
    getCurrentExams,
    getEnrolled,

    addCourse,
    addQuestion,
    addExam,

    enrollStudents,
    removeStudents,
    checkinStudent,

    updateUserRole,
};
