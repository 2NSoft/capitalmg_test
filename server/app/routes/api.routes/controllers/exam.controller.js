const copyObject = require('./../../../../utils/copyObject');
const moment = require('moment');

const init = (data) => {
    const controller = {
        getExams(req, res) {
            if (req.query.student) {
                if (!req.user) {
                    return res.status(403)
                        .send('You need to be logged in!');
                }
                const userId = req.query.student;
                let studentId;
                const result = {};

                return data.students.findByUserId(userId)
                    .then((dbStudent) => {
                        const examPromises = [];
                        result.courses = [];
                        studentId = dbStudent.id + '';
                        dbStudent.courses.forEach((course) => {
                            result.courses.push({
                                id: course.id,
                                name: course.name,
                            });
                            examPromises.push(data.exams.getAll({
                                'course.id': { $eq: course.id },
                            }));
                        });
                        return Promise.all(examPromises);
                    })
                    .then((dbCourseExams) => {
                        const examinerPromises = [];
                        dbCourseExams.forEach((courseExams, index) => {
                            const enrolledExams = [];
                            courseExams.forEach((exam) => {
                                exam.timeSlots = exam.timeSlots || [];
                                exam.timeSlots.forEach((slot) => {
                                    slot.students = slot.students || [];
                                    const indx = slot.students
                                        .findIndex((student) => student.id === studentId); // eslint-disable-line max-len
                                    if (indx !== -1) {
                                        const slotName =
                                            moment(new Date(slot.startDate)).format('DD.M.YY @ HH:mm') + // eslint-disable-line max-len
                                            ' - ' +
                                            moment(new Date(slot.endDate)).format('DD.M.YY @ HH:mm'); // eslint-disable-line max-len
                                        enrolledExams.push({
                                            id: exam.id + '',
                                            name: exam.course.name + ' ' + slotName, // eslint-disable-line max-len
                                            slot: {
                                                startDate: slot.startDate,
                                                endDate: slot.endDate,
                                            },
                                        });
                                        examinerPromises.push(
                                            data.examiners.getAll({
                                                $and: [
                                                    { 'student.id': { $eq: studentId } }, // eslint-disable-line max-len
                                                    { 'exam.id': { $eq: exam.id + '' } }, // eslint-disable-line max-len
                                                    { 'timeSlot.startDate': { $eq: slot.startDate } }, // eslint-disable-line max-len
                                                    { 'timeSlot.endDate': { $eq: slot.endDate } }, // eslint-disable-line max-len
                                                ],
                                            }));
                                    }
                                });
                            });
                            result.courses[index].exams = enrolledExams.slice();
                        });
                        return Promise.all(examinerPromises);
                    })
                    .then((examiners) => {
                        examiners = examiners
                            .map( (examiner) => examiner[0] || {} )
                            .filter( (examiner) => examiner.exam );
                        result.courses.forEach((course) => {
                            if (course.exams) {
                                course.exams.forEach((exm) => {
                                    const examiner =
                                        examiners.find( (examnr) => {
                                            return examnr.exam.id === exm.id &&
                                                examnr.timeSlot.startDate === exm.slot.startDate && // eslint-disable-line max-len
                                                examnr.timeSlot.endDate === exm.slot.endDate; // eslint-disable-line max-len
                                        });
                                    if (examiner) {
                                        const now = Date.now();
                                        const active =
                                            new Date(examiner.timeSlot.startDate) <= now && // eslint-disable-line max-len
                                            now < new Date(examiner.timeSlot.endDate); // eslint-disable-line max-len
                                        exm.examiner = {
                                            id: examiner.id + '',
                                            active,
                                            completed: examiner.completed,
                                            score: examiner.score,
                                        };
                                    }
                                    delete exm.timeSlot;
                                });
                            }
                        });
                        result.courses.forEach( (course) => {
                            if (!course.exams.length) {
                                course.state = 'Pending enrollment...';
                            } else {
                                course.state = 'Preview';
                                course.preview = true;
                            }
                            course.exams.forEach( ( exam ) => {
                                if (!exam.examiner) {
                                    exam.state = 'Pending check-in...';
                                    return true;
                                }
                                if (exam.examiner && exam.examiner.active) {
                                    exam.state = 'Start exam';
                                    exam.startExaminer = exam.examiner.id;
                                    return true;
                                }
                                if (exam.examiner &&
                                    !exam.examiner.active &&
                                    !exam.examiner.completed) {
                                        exam.state = 'Pending score...';
                                        return true;
                                    }
                                    exam.state =
                                    'Score: ' + exam.examiner.score;
                                    exam.completed = true;
                                return true;
                            });
                            return true;
                        });
                        return res.status(200).send(result);
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).send(err);
                    });
            }
            if (req.query.id && !req.query.enrolled && !req.query.checkedin) {
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
            if (req.query.current) {
                return data.exams.getAll()
                    .then((dbExams) => {
                        const current = [];
                        dbExams.forEach((dbExam) => {
                            dbExam.timeSlots = dbExam.timeSlots || [];
                            dbExam.timeSlots.forEach((slot, index) => {
                                const now = Date.now();
                                if (new Date(slot.startDate) <= now &&
                                    now < new Date(slot.endDate)) {
                                    current.push({
                                        name: dbExam.course.name,
                                        id: dbExam._id + '/' + index,
                                    });
                                }
                            });
                        });
                        res.status(200).send(current);
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            if (req.query.checkedin) {
                const examId = req.query.id;
                const slot = req.query.slot;
                let enrolled;
                return data.exams.findById(examId)
                    .then((dbExam) => {
                        enrolled = dbExam.timeSlots[slot].students.slice();
                        const studentPromises = [];
                        enrolled.forEach((student) => {
                            studentPromises.push(
                                data.examiners.getAll({
                                    $and: [
                                        { 'student.id': { $eq: student.id } },
                                        { 'exam.id': { $eq: examId } },
                                    ],
                                })
                            );
                        });
                        return Promise.all(studentPromises);
                    })
                    .then((examiners) => {
                        const current = enrolled
                            .map((s, index) => {
                                if (examiners[index].length) {
                                    s.examinerId = examiners[index][0].id + '';
                                }
                                return s;
                            })
                            .sort((a, b) => a.id.localeCompare(b.id));
                        res.status(200).send(current);
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
