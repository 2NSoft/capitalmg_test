const passport = require('passport');
const copyObject = require('./../../../utils/copyObject');

const attach = (app, data) => {
    const userController =
        require('./controllers/user.controller').init(data);
    const roleController =
        require('./controllers/role.controller').init(data);
    const courseController =
        require('./controllers/course.controller').init(data);
    const questionController =
        require('./controllers/question.controller').init(data);
    const examController =
        require('./controllers/exam.controller').init(data);

    app.get('/api/v1/auth', (req, res) => {
        if (req.user) {
            const returnData = copyObject(req.user);
            returnData.id = req.user.id;
            delete returnData.password;
            delete returnData._id;
            return res.status(200).send(returnData);
        }
        return res.status(401).send('Not logged in!');
    });

    app.post('/api/v1/auth', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.status(401).send('Log in failed!');
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                const returnData = copyObject(req.user);
                returnData.id = req.user.id;
                delete returnData.password;
                delete returnData._id;
                return res.status(200).send(returnData);
            });
            return true;
        })(req, res, next);
    });

    app.delete('/api/v1/auth', (req, res) => {
        req.logout();
        if (req.user) {
            return res.status(500)
                .send('Something went wrong! Still Logged in!');
        }
        return res.status(200).send('Successfully logged out!');
    });

    app.get('/api/v1/users', (req, res) => {
        return userController.getUsers(req, res);
    });

    app.post('/api/v1/users', (req, res) => {
        return userController.addUser(req, res);
    });

    app.put('/api/v1/users', (req, res) => {
        return userController.updateUser(req, res);
    });

    app.get('/api/v1/roles', (req, res) => {
        return roleController.getRoles(req, res);
    });

    app.get('/api/v1/courses', (req, res) => {
        return courseController.getCourses(req, res);
    });

    app.post('/api/v1/courses', (req, res) => {
        return courseController.addCourse(req, res);
    });

    app.put('/api/v1/courses', (req, res) => {
        return courseController.updateCourse(req, res);
    });

    app.get('/api/v1/questions', (req, res) => {
        return questionController.getQuestions(req, res);
    });

    app.post('/api/v1/questions', (req, res) => {
        return questionController.addQuestion(req, res);
    });

    app.post('/api/v1/exams', (req, res) => {
        return examController.addExam(req, res);
    });
};

module.exports = attach;
