const express = require('express');
const { userEmail } = require('../controller/api'); 
const router = express.Router();

router.post('/data/:id', userEmail); 

module.exports = router; 