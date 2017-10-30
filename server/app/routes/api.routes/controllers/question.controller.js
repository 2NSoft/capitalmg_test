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
            if (req.query.course) {
                if (!req.user || req.user.role !== 'docent') {
                    return res
                        .status(403)
                        .send('You need to be logged in as docent!');
                }
                return data.questions
                    .getAll( { 'course.id': { $eq: req.query.course } })
                    .then( (questions) => {
                        if (req.query.preview) {
                            questions = questions.map( (question) => {
                                const result = {
                                    model: question,
                                };
                                result._id = question._id;
                                result.description =
                                    question.title.split('<br>')[0];
                                result.description += '<br> #' + result._id;
                                delete result.model._id;
                                return result;
                            });
                        }
                        questions = questions.map( (question) => {
                            question.id = question._id + '';
                            delete question._id;
                            return question;
                        });
                        return res.status(200).send(questions);
                    })
                    .catch( (err) => {
                        return res.status(500).send(err);
                    });
            }
            return true;
        },
        addQuestion(req, res) {
            if (!req.user || req.user.role !== 'docent') {
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
