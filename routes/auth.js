const express = require('express');
const {register, login, getMe, getUsers, updateUser, deleteUser} = require('../controllers/auth');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);



module.exports = router;