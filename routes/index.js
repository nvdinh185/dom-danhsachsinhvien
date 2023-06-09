const studentRouter = require('./student');
const classRouter = require('./class');

function route(app) {
    app.use('/student', studentRouter);
    app.use('/class', classRouter);
}

module.exports = route;
