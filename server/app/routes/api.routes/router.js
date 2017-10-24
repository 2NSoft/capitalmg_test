const passport = require('passport');
const copyObject = require('./../../../utils/copyObject');

const attach = (app, data) => {
    const userController =
        require('./controllers/user.controller').init(data);

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
        if (!req.user) {
            return res.status(400).send('You need to be logged in!');
        }
        return userController.updateUser(req, res);
    });
};

module.exports = attach;