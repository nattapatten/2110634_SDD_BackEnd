const express = require('express');
const {register, login, getMe, getUsers, updateUser, deleteUser, verifyOtp} = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.post('/verify-otp', verifyOtp);


// router.post('/register', register);
// router.post('/login', login);
// router.get('/me',  getMe);
// router.get('/users',   getUsers);
// router.put('/users/:id', updateUser);
// router.delete('/users/:id',  deleteUser);
// router.post('/verify-otp', verifyOtp);
module.exports = router;