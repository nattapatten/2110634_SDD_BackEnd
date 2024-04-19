const express = require('express');
const { getStudent,createStudent,updateStudent,deleteStudent, getStudentbyID, getStudents, getStudentsByAdvisorID} = require('../controllers/student');

const router = express.Router({mergeParams:true});
const {protect,protect2, authorize} = require('../middleware/auth');


router.get('/me', getStudent);
router.get('/',getStudentbyID).get('/students',getStudents).get('/:advisorID', getStudentsByAdvisorID);
router.post('/', createStudent);
router.put('/', updateStudent);
router.delete('/',deleteStudent);



module.exports=router;