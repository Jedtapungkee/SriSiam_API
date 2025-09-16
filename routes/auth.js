const express = require('express');
const { register, login,googleCallback, currentUser, resetPassword, forgotPassword, verifyOtp } = require('../controllers/auth');
const router = express.Router();
const passport = require('../config/passport');

const { authCheck, adminCheck } = require('../middlewares/authCheck');
const { validator, registerSchema } = require('../utils/validateData');


router.post("/register", validator(registerSchema), register)
router.post("/login",login)
router.post("/current-user",authCheck,currentUser);
router.post("/current-admin",authCheck,adminCheck,currentUser);
router.post("/forgot-password",forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);



// เริ่ม Auth กับ Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    googleCallback
);

// google login payload
router.get('/google/login/success', authCheck, (req, res) => {
    res.json({
        payload:req.user
    })
})

module.exports = router;