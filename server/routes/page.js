const express = require('express');
const { main, cart, map, pay, card, payS} = require('../controller/page');
const router = express.Router();

router.get('/', main);
router.get('/cart/:id', cart);
router.get('/map/:id', map);
router.get('/pay/:id', pay);
router.get('/card/:id', card);
router.get('/payment-success', payS);


module.exports = router;