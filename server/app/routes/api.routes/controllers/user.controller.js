const copyObject = require('./../../../../utils/copyObject');

const init = (data) => {
    const controller = {
        getUsers(req, res) {
            return data.users.getAll()
                .then((users) => {
                    users = users
                        .map((user) => {
                            const result = copyObject(user);
                            result.id = user.id;
                            delete result.password;
                            delete result._id;
                            return result;
                        });
                    if (req.query.notconfirmed) {
                        return users
                            .filter((user) => !user.confirmed);
                    }
                    return users;
                })
                .then((users) => {
                    return res.status(200).send(users);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        addUser(req, res) {
            const model = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePic: 'user.png',
                confirmed: false,
            };

            if (!data.users.validator.isValid(model)) {
                return Promise.reject(res.status(400)
                    .send('Data does not meet requirements!'));
            }

            return data.users.findUser(model.username)
                .then((user) => {
                    if (user) {
                        return Promise.reject('Username already exists!');
                    }
                    return data.users.filter({
                        email: model.email,
                    });
                })
                .then((users) => {
                    if (users.length) {
                        return Promise.reject('Email already used!');
                    }
                    return data.users.create(model);
                })
                .then(() => {
                    return res.status(200).send('User successfully added!');
                })
                .catch((err) => {
                    return res.status(400).send(err);
                });
        },
        updateUser(req, res) {
            if (!req.user) {
                return res.status(400).send('You need to be logged in!');
            }
            if (req.body.updateRole) {
                if (req.user.role !== 'administrator') {
                    return res.status(403)
                        .send('You need to be logged in as administrator!');
                }
                return Promise.all([
                    data.users.findById(req.body.userId),
                    data.roles.findById(req.body.role),
                ])
                    .then(([user, role]) => {
                        user.role = role.rolename;
                        user.confirmed = true;
                        return data.users.updateById(user);
                    })
                    .then(() => {
                        return res.status(200).send(req.body.userId);
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            return data.users.findById(req.user.id)
                .then((user) => {
                    user.username = req.user.username;
                    user.email = req.body.email || user.email;
                    user.password = req.body.password || user.password;
                    if (req.file) {
                        user.profilePic = req.file.filename;
                    }
                    if (!data.users.validator.isValid(user)) {
                        return Promise
                            .reject('Data does not meet requirements!');
                    }
                    return Promise.all([user, data.users.filter({
                        email: user.email,
                    })]);
                })
                .then(([validUser, users]) => {
                    const index = users
                        .findIndex((user) =>
                            user.id.toString() !== validUser.id.toString());
                    if (index !== -1) {
                        return Promise.reject('E-mail already in use!');
                    }
                    return data.users.updateById(validUser, req.body.password);
                })
                .then((user) => {
                    return res.status(200)
                        .send('User successfully updated!');
                })
                .catch((err) => {
                    return res.status(400).send(err);
                });
        },
    };

    return controller;
};


module.exports = {
    init,
};
