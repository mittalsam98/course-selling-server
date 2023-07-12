const express = require('express');
const { checkout, getKey, paymentVerification } = require('../controllers/paymentController');
const { authenticateJwtUser, authenticateJwtAdmin } = require('../controllers/auth');
const { purchaseCourse } = require('../controllers/course');
const router = express.Router();

router.get('/getkey', authenticateJwtUser, getKey);
router.post('/checkout', authenticateJwtUser, checkout);
router.post('/paymentverification', authenticateJwtUser, paymentVerification, purchaseCourse);

module.exports = router;
