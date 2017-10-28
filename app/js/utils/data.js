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

const getQuestionData = () => {
    return Promise.all([getCourses(), getQuestionTypes()]);
};

module.exports = {
    getUserConfirmData,
    getCourseCreateData,
    getQuestionData,

    addCourse,
    addQuestion,

    updateUserRole,
};
