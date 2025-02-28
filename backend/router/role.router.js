const express=require('express');
const { getRoles, createRole } = require('../controller/role.controller');
const router=express.Router();


router.get('/',getRoles);

// router.get('/:id',);

router.post('/',createRole);



module.exports=router;