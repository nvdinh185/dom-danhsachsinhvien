const studentsRoute = require('./students');
const classesRoute = require('./classes');

function route(app) {
    app.use('/students', studentsRoute);
    app.use('/classes', classesRoute);
}

module.exports = route;
