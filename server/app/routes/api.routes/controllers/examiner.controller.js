const copyObject = require('./../../../../utils/copyObject');
const moment = require('moment');

const init = (data) => {
    const controller = {
        getExams(req, res) {

        },
        addExaminer(req, res) {
            if (!req.user || req.user.role !== 'docassistant') {
                return res.status(403)
                    .send('You need to be logged in as docent!');
            }
            const model = {
                exam: req.body.examId,
                completed: false,
                timeSlot: req.body.slot,
                student: req.body.student,
            };
            return data.exams.findById( model.exam )
                .then((dbExam) => {
                    model.exam = {
                        id: dbExam.id + '',
                        name: dbExam.course.name,
                    };
                    model.timeSlot =
                        copyObject( dbExam.timeSlots[model.timeSlot]);
                    delete model.timeSlot.students;
                    model.questions =
                        copyObject( dbExam.questions, [] );
                    model.number = dbExam.questionsNumber;
                    while (model.questions.length > model.numQuestions) {
                        const index = Math.random() * model.questions.length;
                        model.questions.splice( index, 1);
                    }
                    model.questions =
                        model.questions.map( (question) => {
                            delete question.correctAnswers;
                            delete question.course;
                            return question;
                        });
                    return data.students.findById( model.student );
                })
                .then( (dbStudent) => {
                    model.student = {
                        id: dbStudent.id + '',
                        name: dbStudent.name,
                    };
                    return Promise.all([
                        data.examiners.create( model ),
                        dbStudent,
                    ]);
                })
                .then( ([dbExaminer, dbStudent]) => {
                    dbStudent.examiners = dbStudent.examiners || [];
                    dbStudent.examiners.push( dbExaminer.id + '');
                    return Promise.all([
                        dbExaminer,
                        data.students.updateById(dbStudent),
                    ]);
                })
                .then(([dbExaminer]) => {
                    return res.status(200).send(dbExaminer.id+'');
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        updateExaminer(req, res) {
        },
    };

    return controller;
};


module.exports = {
    init,
};
