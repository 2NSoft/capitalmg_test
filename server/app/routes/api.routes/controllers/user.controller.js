const init = (data) => {
    const controller = {
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
            return data.users.findById(req.user.id)
                .then((user) => {
                    user.username = req.user.username;
                    user.email = req.body.email || user.email;
                    user.password = req.body.password || user.password;
                    if (req.file) {
                        user.stringProfilePicture = req.file.filename;
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
