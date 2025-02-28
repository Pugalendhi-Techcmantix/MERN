const express=require('express');
const { getStudents, getStudent, creatStudents, updateStudent, deleteStudent } = require('../controller/crud.controller');
const router=express.Router();



router.get('/',getStudents);

router.get('/:id',getStudent);

router.post('/',creatStudents);

router.put('/:id',updateStudent);

router.delete('/:id',deleteStudent);


module.exports=router;