const express = require('express');
const router = express.Router();

const classController = require('../controllers/ClassController');

router.get("/", classController.getListClass);


module.exports = router;
