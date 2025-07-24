const express = require('express');
const { register, login,googleCallback, currentUser } = require('../controllers/auth');
const router = express.Router();
const passport = require('../config/passport');

const { authCheck, adminCheck } = require('../middlewares/authCheck');


router.post("/register", register)
router.post("/login",login)
router.post("/current-user",authCheck,currentUser);
router.post("/current-admin",authCheck,adminCheck,currentUser);

// เริ่ม Auth กับ Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    googleCallback
);

module.exports = router;