const mysql = require('mysql');

const configDB = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "students"
};

class StudentController {

    // [GET] /student
    async getListStudents(req, res) {
        try {
            var conn = mysql.createConnection(configDB);

            const listStudents = await new Promise((resolve, reject) => {
                conn.query(`SELECT st.id, st.name, cl.name as className
                FROM students as st JOIN class_info as cl ON st.class_id = cl.id;`, (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                })
            })
            res.status(200).send(listStudents);
        } catch (err) {
            res.status(500).send(err);
        } finally {
            conn.end();
        }
    }

    // [GET] /student/:id
    async getStudentById(req, res) {
        try {
            var conn = mysql.createConnection(configDB);

            const id = req.params.id;
            const student = await new Promise((resolve, reject) => {
                conn.query(`SELECT st.id, st.name, st.class_id as classId, cl.name as className
                FROM students as st JOIN class_info as cl ON st.class_id = cl.id WHERE st.id = '${id}'`, (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                })
            })
            res.status(200).send(student[0]);
        } catch (err) {
            res.status(500).send(err);
        } finally {
            conn.end();
        }
    }

    // [POST] /student/add
    async createStudent(req, res) {
        const { id, name, classId } = req.body;
        try {
            var conn = mysql.createConnection(configDB);
            const newStudent = await new Promise((resolve, reject) => {
                conn.query(`INSERT INTO students VALUES (?, ?, ?)`,
                    [id, name, classId], function (err, results) {
                        if (err) {
                            reject(new Error(err.message));
                        }
                        resolve(results);
                    });
            });
            res.status(200).send(newStudent);
        } catch (error) {
            res.status(500).send(error);
        } finally {
            conn.end();
        }
    }

    // [DELETE] /student/:id
    async deleteStudent(req, res) {
        try {
            var conn = mysql.createConnection(configDB);
            const id = req.params.id;
            const deleteStudent = await new Promise((resolve, reject) => {
                conn.query(`DELETE FROM students WHERE id = '${id}'`, function (err, results) {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            })
            res.status(200).send(deleteStudent);
        } catch (error) {
            res.status(500).send(error);
        } finally {
            conn.end();
        }
    }

    // [PUT] /student/:id
    async updateStudent(req, res) {
        try {
            var conn = mysql.createConnection(configDB);
            const { id, name, classId } = req.body;
            const updateStudent = await new Promise((resolve, reject) => {
                conn.query(`UPDATE students SET name = '${name}', class_id = '${classId}' WHERE id = '${id}'`,
                    function (err, results) {
                        if (err) {
                            reject(new Error(err.message));
                        }
                        resolve(results);
                    });
            })
            res.status(200).send(updateStudent);
        } catch (error) {
            res.status(500).send(error);
        } finally {
            conn.end();
        }
    }
}

module.exports = new StudentController();
