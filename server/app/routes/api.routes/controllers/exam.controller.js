const copyObject = require('./../../../../utils/copyObject');
const moment = require('moment');

const init = (data) => {
    const controller = {
        getExams(req, res) {
            if (req.query.id && !req.query.enrolled) {
                return data.exams.findById(req.query.id)
                    .then((exam) => {
                        const result = {
                            id: exam.id + '',
                            timeSlots:
                            exam.timeSlots.map((slot, index) => {
                                const name =
                                    moment(new Date(slot.startDate)).format('DD.M.YY @ HH:mm') + // eslint-disable-line max-len
                                    ' - ' +
                                    moment(new Date(slot.endDate)).format('DD.M.YY @ HH:mm'); // eslint-disable-line max-len
                                return {
                                    id: index,
                                    name,
                                };
                            }),
                        };
                        return res.status(200).send(result);
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            if (req.query.id && req.query.enrolled) {
                const examId = req.query.id;
                const slot = req.query.slot;
                let available = [];
                let enrolled = [];
                return data.exams.findById(examId)
                    .then((dbExam) => {
                        dbExam.timeSlots[slot].students =
                            dbExam.timeSlots[slot].students || [];
                        dbExam.timeSlots[slot].students.forEach((student) => {
                            enrolled.push({
                                id: student.id,
                                name: student.name,
                            });
                        });
                        return data.courses.findById(dbExam.course.id);
                    })
                    .then((dbCourse) => {
                        dbCourse.students = dbCourse.students || [];
                        dbCourse.students.forEach((student) => {
                            available.push({
                                id: student.id,
                                name: student.name,
                            });
                        });
                        available =
                            available.filter((avl) => {
                                return enrolled.findIndex((enr) => {
                                    return enr.id === avl.id;
                                }) === -1;
                            });
                        available =
                            available.sort((a, b) => a.id.localeCompare(b.id));
                        enrolled =
                            enrolled.sort((a, b) => a.id.localeCompare(b.id));
                        return res.status(200).send({ available, enrolled });
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            return data.exams.getAll()
                .then((exams) => {
                    exams = exams.map((exam) => {
                        return {
                            id: exam.id + '',
                            name: exam.course.name,
                        };
                    });
                    return res.status(200).send(exams);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        addExam(req, res) {
            if (!req.user || req.user.role !== 'docent') {
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
                    questionPromises.push(data.questions.findById(id));
                });
            return Promise.all(questionPromises)
                .then((questions) => {
                    const filtered = questions.map((question) => {
                        const result = copyObject(question);
                        result.id = question.id + '';
                        delete result._id;
                        return result;
                    });
                    examModel.questions = filtered.slice();
                    return data.exams.create(examModel);
                })
                .then(() => {
                    const name = examModel.course.name;
                    return res.status(200)
                        .send(`${name} exam successfully created.`);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        updateExam(req, res) {
            if (req.query.enroll || req.query.remove) {
                if (!req.user || req.user.role !== 'docsecretary') {
                    return res.status(403)
                        .send('You need to be logged in as secretary!');
                }
            }
            if (req.query.enroll) {
                const examId = req.query.id;
                const students = req.body.students;
                const slot = +req.body.slot;
                let studentPromises = [];
                students.forEach((student) => {
                    studentPromises.push(data.students.findById(student));
                });
                return Promise.all([
                    data.exams.findById(examId),
                    Promise.all(studentPromises),
                ])
                    .then(([dbExam, dbStudents]) => {
                        studentPromises = [];
                        dbExam.timeSlots[slot].students =
                            dbExam.timeSlots[slot].students || [];
                        dbStudents.forEach((dbStudent) => {
                            dbExam.timeSlots[slot].students.push({
                                id: dbStudent.id + '',
                                name: dbStudent.name,
                            });
                        });
                        return data.exams.updateById(dbExam);
                    })
                    .then(() => {
                        return res.status(200).send();
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            if (req.query.remove) {
                const examId = req.query.id;
                const students = req.body.students;
                const slot = +req.body.slot;
                return data.exams.findById(examId)
                    .then((dbExam) => {
                        dbExam.timeSlots[slot].students =
                            dbExam.timeSlots[slot].students || [];
                        dbExam.timeSlots[slot].students =
                            dbExam.timeSlots[slot].students.filter((std) => {
                                    return students.findIndex((student) => {
                                        return student === std.id;
                                    }) === -1;
                                });
                        return data.exams.updateById(dbExam);
                    })
                    .then(() => {
                        return res.status(200).send();
                    })
                    .catch((err) => {
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
