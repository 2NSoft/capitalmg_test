const copyObject = require('./../../../../utils/copyObject');

const init = (data) => {
    const controller = {
        addExam(req, res) {
            if (req.user.role !== 'docent') {
                return res.status(403)
                    .send('You need to be logged in as docent!');
            }
            const questionPromises = [];
            const examModel = {
                course: req.body.course,
                questionsNumber: req.body.questionsNumber,
                timeSlots: req.body.timeSlots,
            };
            req.body.questions
                .forEach((id) => {
                    questionPromises.push( data.questions.findById(id) );
                });
            return Promise.all( questionPromises )
                .then( (questions) => {
                    const filtered = questions.map( (question) => {
                        const result = copyObject(question);
                        result.id = question.id + '';
                        delete result._id;
                        return result;
                    });
                    examModel.questions = filtered.slice();
                    return data.exams.create( examModel );
                })
                .then( () => {
                    const name = examModel.course.name;
                    return res.status(200)
                        .send( `${name} exam successfully created.` );
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
