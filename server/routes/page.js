const express = require('express');
const { main, cart, map } = require('../controller/page');
const router = express.Router();

router.get('/', main);
router.get('/cart/:id', cart);
router.get('/map/:id', map);

module.exports = router;
