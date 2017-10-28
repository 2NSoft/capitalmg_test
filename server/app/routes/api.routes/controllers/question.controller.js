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
        addQuestion(req, res) {
            if (req.user.role !== 'docent') {
                return res
                    .status(403).send('You need to be logged in as docent!');
            }
            return data.questions.create(req.body)
                .then( (dbQuestion) => {
                    return res.status(200).send(dbQuestion.id + '');
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
