const express = require('express');
const {register, login, getMe, getUsers, updateUser, deleteUser, verifyOtp,verifyOtpRegistration , loginStudent} = require('../controllers/auth');


const router = express.Router();

const { protect, authorize } = require('../middleware/auth');


// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.get('/users', protect, authorize('admin'), getUsers);
// router.put('/users/:id', protect, authorize('admin'), updateUser);
// router.delete('/users/:id', protect, authorize('admin'), deleteUser);
// router.post('/verify-otp', verifyOtp);


// Use this without Protect and authorize
router.post('/register', register);
router.post('/login', login).post('/loginStudent',loginStudent);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.post('/verify-otp', verifyOtp);
router.post('/verify-otp-registration', verifyOtpRegistration);


module.exports = router;