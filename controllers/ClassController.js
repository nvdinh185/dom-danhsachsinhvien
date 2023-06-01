const mysql = require('mysql');

const configDB = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "students"
};

class ClassController {

    // [GET] /classes
    async getClasses(req, res) {
        try {
            var conn = mysql.createConnection(configDB);

            const listStudents = await new Promise((resolve, reject) => {
                conn.query(`SELECT * from class_info`, (err, row) => {
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
}

module.exports = new ClassController();
