const express = require('express');
const { getNotifications, getNotification, createNotification, getNotificationsByAdvisorID, updateNotification, deleteNotification , getNotificationsByStudentD } = require('../controllers/notification');
const { protect, authorize } = require('../middleware/auth');



const router = express.Router();


const IsUseProtect = 0;
// router.route('/').get(getNotifications).post(protect, authorize('teacher'), createNotification);
// router.route('/:id').get(getNotification).put(protect, authorize('teacher'), updateNotification).delete(protect, authorize('teacher'), deleteNotification);


//Operate CRUD without protect middleware by setting value
const protectMiddleware = IsUseProtect ? protect : (req, res, next) => next();

router.route('/')
    .get(getNotifications)
    .post(protectMiddleware, createNotification);

router.route('/:id')
    .get(getNotification)
    .put(protectMiddleware, updateNotification)
    .delete(protectMiddleware, deleteNotification);

router.get('/by-advisor/:advisorID', getNotificationsByAdvisorID);

router.get('/by-student/:studentID', getNotificationsByStudentD);


module.exports = router;