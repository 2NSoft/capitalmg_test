const init = (data) => {
    const controller = {
        getCourses(req, res) {
            if (req.query.id && req.query.enrolled) {
                const courseId = req.query.id;
                return data.students.getAll()
                    .then((students) => {
                        let available = [];
                        let enrolled = [];
                        students.forEach((student) => {
                            const result = {
                                id: student._id + '',
                                name: student.name,
                            };
                            if (student.courses &&
                                student.courses.find((course) => {
                                    return course.id === courseId;
                                })) {
                                enrolled.push(result);
                            } else {
                                available.push(result);
                            }
                        });
                        available =
                            available.sort((a, b) => a.id.localeCompare(b.id));
                        enrolled =
                            enrolled.sort((a, b) => a.id.localeCompare(b.id));
                        res.status(200).send({ available, enrolled });
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            return data.courses.getAll()
                .then((courses) => {
                    courses = courses.map((course) => {
                        return {
                            id: course.id + '',
                            name: course.name,
                        };
                    });
                    return res.status(200).send(courses);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        addCourse(req, res) {
            if (req.user.role !== 'administrator') {
                return res.status(403)
                    .send('You need to be logged in as administrator!');
            }
            let docentPromises = [];
            const courseModel = {
                name: req.body.name,
                docents: req.body.docents,
            };
            courseModel.docents
                .forEach((id) => {
                    docentPromises.push(data.docents.findByUserId(id));
                });
            return Promise.all(docentPromises)
                .then((docents) => {
                    const filtered = docents.map((docent) => {
                        return {
                            id: docent.id + '',
                            name: docent.name,
                        };
                    });
                    courseModel.docents = filtered.slice();
                    return Promise.all([
                        data.courses.create(courseModel),
                        docents]);
                })
                .then(([dbCourse, docents]) => {
                    docentPromises = [];
                    docents.forEach((docent) => {
                        docent.courses = docent.courses || [];
                        docent.courses.push({
                            id: dbCourse.id + '',
                            name: dbCourse.name,
                        });
                        docentPromises.push(data.docents.updateById(docent));
                    });
                    return Promise.all([dbCourse.name, docentPromises]);
                })
                .then(([name]) => {
                    return res.status(200)
                        .send(`Course "${name}" successfully created.`);
                })
                .catch((err) => {
                    return res.status(500).send(err);
                });
        },
        updateCourse(req, res) {
            // if (req.query.enroll || req.query.remove) {
            //     if (req.user.role !== 'docsecretary') {
            //         return res.status(403)
            //             .send('You need to be logged in as secretary!');
            //     }
            // }
            if (req.query.enroll) {
                const courseId = req.query.id;
                const students = req.body.students;
                let studentPromises = [];
                students.forEach((student) => {
                    studentPromises.push(data.students.findById(student));
                });
                return Promise.all([
                    data.courses.findById(courseId),
                    Promise.all(studentPromises),
                ])
                    .then(([dbCourse, dbStudents]) => {
                        studentPromises = [];
                        dbCourse.students = dbCourse.students || [];
                        dbStudents.forEach((dbStudent) => {
                            dbCourse.students.push({
                                id: dbStudent.id + '',
                                name: dbStudent.name,
                            });
                            dbStudent.courses = dbStudent.courses || [];
                            dbStudent.courses.push({
                                id: dbCourse.id + '',
                                name: dbCourse.name,
                            });
                            studentPromises.push(
                                data.students.updateById(dbStudent)
                            );
                        });
                        return Promise.all([
                            Promise.all(studentPromises),
                            data.courses.updateById(dbCourse),
                        ]);
                    })
                    .then(() => {
                        return res.status(200).send();
                    })
                    .catch((err) => {
                        return res.status(500).send(err);
                    });
            }
            if (req.query.remove) {
                const courseId = req.query.id;
                const students = req.body.students;
                let studentPromises = [];
                students.forEach((student) => {
                    studentPromises.push(data.students.findById(student));
                });
                return Promise.all([
                    data.courses.findById(courseId),
                    Promise.all(studentPromises),
                ])
                    .then(([dbCourse, dbStudents]) => {
                        studentPromises = [];
                        dbCourse.students =
                            dbCourse.students.filter((std) => {
                                return dbStudents.findIndex((student) => {
                                    return (student.id+'') === std.id;
                                }) === -1;
                            });
                        dbStudents.forEach((dbStudent) => {
                            dbStudent.courses =
                                dbStudent.courses
                                    .filter((crs) => crs.id !== courseId);
                            studentPromises.push(
                                data.students.updateById(dbStudent)
                            );
                        });
                        return Promise.all([
                            Promise.all(studentPromises),
                            data.courses.updateById(dbCourse),
                        ]);
                    })
                    .then(() => {
                        return res.status(200).send();
                    })
                    .catch((err) => {
                        console.log(err);
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
