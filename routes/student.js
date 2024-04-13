const express = require('express');
const { getStudent,createStudent,updateStudent,deleteStudent, getStudentbyID} = require('../controllers/student');

const router = express.Router({mergeParams:true});
const {protect,protect2, authorize} = require('../middleware/auth');


router.get('/me',protect2, getStudent);
router.get('/', getStudent,getStudentbyID);
router.post('/', createStudent);
router.put('/',protect,updateStudent);
router.delete('/',protect,deleteStudent);


module.exports=router;