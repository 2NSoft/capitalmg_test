const init = (data) => {
    const controller = {
        getCourses(req, res) {
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
                    docentPromises.push( data.docents.findByUserId(id) );
                });
            return Promise.all( docentPromises )
                .then( (docents) => {
                    const filtered = docents.map( (docent) => {
                        return {
                            id: docent.id + '',
                            name: docent.name,
                        };
                    });
                    courseModel.docents = filtered.slice();
                    return Promise.all([
                        data.courses.create( courseModel ),
                        docents]);
                })
                .then( ([dbCourse, docents]) => {
                    docentPromises = [];
                    docents.forEach( (docent) => {
                        docent.courses = docent.courses || [];
                        docent.courses.push( {
                            id: dbCourse.id + '',
                            name: dbCourse.name,
                        });
                        docentPromises.push( data.docents.updateById(docent));
                    });
                    return Promise.all( [dbCourse.name, docentPromises] );
                })
                .then( ([name]) => {
                    return res.status(200)
                        .send( `Course "${name}" successfully created.` );
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
