const init = (data) => {
    const controller = {
        getQuestions(req, res) {
            if (req.query.questiontypes) {
            return data.questiontypes.getAll()
                .then((questiontypes) => {
                    questiontypes = questiontypes.map( (questiontype) => {
                        return {
                            id: questiontype.id + '',
                            name: questiontype.name,
                        };
                    });
                    return res.status(200).send(questiontypes);
                })
                .catch( (err) => {
                    return res.status(500).send(err);
                });
            }
            return true;
        },
    };

    return controller;
};


module.exports = {
    init,
};
