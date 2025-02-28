const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const crudRoute=require('./router/crud.router.js');
const roleRoute=require('./router/role.router.js');
const empRoute=require('./router/emp.router.js');
const productsRoute=require('./router/product.router.js');
const app=express();

app.use(express.json());

app.use(cors({
    origin:"*",
    method:["GET","POST","PUT","DELETE"]
}))

app.use('/crud',crudRoute);
app.use('/role',roleRoute);
app.use('/emp',empRoute);
app.use('/products',productsRoute);

mongoose.connect("mongodb://localhost:27017/CRUD")
.then(()=>{
    console.log("db connected");
    app.listen(4000,()=>{
        console.log("server is running http://localhost:4000");
    })
})
.catch(()=>{
    console.log("db failed");
})