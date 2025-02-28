const mongoose=require('mongoose');

const crudSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rollno:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true,
    }
},
{
    timestamps:true
});

const CRUD=mongoose.model("CRUD",crudSchema);
module.exports=CRUD;