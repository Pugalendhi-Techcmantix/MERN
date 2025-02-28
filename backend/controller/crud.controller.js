const CRUD=require('../model/crud.model.js');

const getStudents=async(req,res)=>{
    try {
        const getStudents=await CRUD.find({});
        res.status(200).json(getStudents);
    } catch (error) {
        res.status(500).json(error);
    }
}
const getStudent=async(req,res)=>{
    try {
        const {id}=req.params;
        const getStudent=await CRUD.findById(id);
        res.status(200).json(getStudent);
    } catch (error) {
        res.status(500).json(error);
    }
}
const creatStudents=async(req,res)=>{
    try {
        const creatStudents=await CRUD.create(req.body);
        res.status(200).json(creatStudents);
    } catch (error) {
        res.status(500).json(error);
    }
}


const updateStudent=async(req,res)=>{
    try {
        const {id}=req.params;
        const updateStudent=await CRUD.findByIdAndUpdate(id,req.body);
        res.status(200).json("Succesfully Updated.");
    } catch (error) {
        res.status(500).json(error);
    }
}
const deleteStudent=async(req,res)=>{
    try {
        const {id}=req.params;
        const deleteStudent=await CRUD.findByIdAndDelete(id);
        res.status(200).json("Succesfully Deleted.");
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports={
    getStudents,
    getStudent,
    creatStudents,
    updateStudent,
    deleteStudent
}