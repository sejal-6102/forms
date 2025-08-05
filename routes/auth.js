const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/forgot', authControllers.forgotPassword);
router.post('/reset', authControllers.verifyCodeAndReset);

module.exports = router;
