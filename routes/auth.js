const express = require('express');
const { signup, signin, adminSignup, adminSignin } = require('../controllers/auth');
const router = express.Router();

router.post('/user/signup', signup);
router.post('/user/signin', signin);

//TO:DO
router.post('/admin/signup', adminSignup);
router.post('/admin/signin', adminSignin);

module.exports = router;
