const express = require('express');
const { cam } = require('../controller/api');
const router = express.Router();

router.post('/cam', cam); 

module.exports = router; 