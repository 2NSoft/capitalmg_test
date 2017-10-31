const copyObject = require('./../../../../utils/copyObject');
const moment = require('moment');

const init = (data) => {
    const controller = {
        getExaminer(req, res) {
            if (!req.query.id) {
                return res.status(400)
                    .send('Not enough parameters!');
            }
            if (!req.user) {
                return res.status(403)
                    .send('You need to be logged in!');
            }
            return Promise.all([
                data.students.findByUserId( req.user.id + ''),
                data.examiners.findById( req.query.id ),
            ])
                .then(([dbStudent, dbExaminer]) => {
                    const now = Date.now();
                    const active =
                        new Date(dbExaminer.timeSlot.startDate) <= now &&
                        now < new Date(dbExaminer.timeSlot.endDate);
                    if (dbStudent.id + '' !== dbExaminer.student.id ||
                        !active) {
                        return Promise.reject('Unauthorized access!');
                    }
                    const questionNum = req.query.question;
                    if (questionNum) {
                        const question =
                            copyObject(dbExaminer.questions[questionNum]);
                        delete question.correctAnswers;
                        return res.status(200).send(question);
                    }
                    const slotName =
                        moment(new Date(dbExaminer.timeSlot.startDate)).format('DD.M.YY @ HH:mm') + // eslint-disable-line max-len
                        ' - ' +
                        moment(new Date(dbExaminer.timeSlot.endDate)).format('DD.M.YY @ HH:mm'); // eslint-disable-line max-len
                    const examiner = {
                        pageNum: dbExaminer.number,
                        name: dbExaminer.exam.name + ' ' + slotName,
                        id: dbExaminer.id + '',
                    };
                    return res.status(200).send(examiner);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
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
            return data.exams.findById(model.exam)
                .then((dbExam) => {
                    model.exam = {
                        id: dbExam.id + '',
                        name: dbExam.course.name,
                    };
                    model.timeSlot =
                        copyObject(dbExam.timeSlots[model.timeSlot]);
                    delete model.timeSlot.students;
                    model.questions =
                        copyObject(dbExam.questions, []);
                    model.number = dbExam.questionsNumber;
                    while (model.questions.length > model.numQuestions) {
                        const index = Math.random() * model.questions.length;
                        model.questions.splice(index, 1);
                    }
                    model.questions =
                        model.questions.map((question) => {
                            delete question.correctAnswers;
                            delete question.course;
                            return question;
                        });
                    return data.students.findById(model.student);
                })
                .then((dbStudent) => {
                    model.student = {
                        id: dbStudent.id + '',
                        name: dbStudent.name,
                    };
                    return Promise.all([
                        data.examiners.create(model),
                        dbStudent,
                    ]);
                })
                .then(([dbExaminer, dbStudent]) => {
                    dbStudent.examiners = dbStudent.examiners || [];
                    dbStudent.examiners.push(dbExaminer.id + '');
                    return Promise.all([
                        dbExaminer,
                        data.students.updateById(dbStudent),
                    ]);
                })
                .then(([dbExaminer]) => {
                    return res.status(200).send(dbExaminer.id + '');
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
