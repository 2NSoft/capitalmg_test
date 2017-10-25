const copyObject = require('./../../../../utils/copyObject');

const init = (data) => {
    const controller = {
        getRoles(req, res) {
            if (!req.user || req.user.role !== 'administrator') {
                return res.status(403)
                    .send('You need to be logged in as administrator!');
            }
            return data.roles.getAll()
                .then((roles) => {
                    roles = roles.map( (role) => {
                        const result = copyObject(role);
                        result.id = role.id;
                        delete result._id;
                        return result;
                    });
                    return res.status(200).send(roles);
                })
                .catch( (err) => {
                    return res.status(500).send(err);
                });
        },
    };

    return controller;
};


module.exports = {
    init,
};
