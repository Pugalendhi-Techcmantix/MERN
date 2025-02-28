import React, { useEffect, useState } from 'react';
import "../App.css"
import {Button, Card, Form, Row, Table} from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
function Crud() {

    const [All,setAll]=useState([]);
    const[name,setName]=useState('')
    const[rollno,setRollno]=useState('')
    const[age,setAge]=useState('')
    const[id,setId]=useState('')


    useEffect(()=>{
      Alldata();
    },[])
const Alldata=()=>{
  axios.get("http://localhost:4000/crud")
  .then((res)=>{
     console.log(res.data);
     setAll(res.data);
  })
  .catch((err)=>{
    console.log(err);
    toast.error("fetch error!");
    
  })
}

const handleSubmit=(e)=>{
  e.preventDefault();
  let postData={
    name:name,
    rollno:rollno,
    age:age
  };
  axios.post(`http://localhost:4000/crud`,postData)
  .then((res)=>{
    console.log(res.data);
    toast.success("Added SuccesFully")
    Alldata();
  })
  .catch((err)=>{
    console.log(err);
    toast.error("Invalid : Try again!");
    
  })
}

const handleDelete=(id)=>{
  axios.delete(`http://localhost:4000/crud/${id}`)
  .then((res)=>{
    console.log(res.data);
    toast.success(res.data);
    Alldata();
  })
  .catch((err)=>{
    console.log(err);
    toast.error("Invalid : Try again!");
  })
};

const handleUpdate=(e)=>{
  e.preventDefault();
  let putData={
    name:name,
    rollno:rollno,
    age:age
  };
  axios.put(`http://localhost:4000/crud/${id}`,putData)
  .then((res)=>{
    console.log(res.data);
    toast.success(res.data);
    Alldata();
  })
  .catch((err)=>{
    console.log(err);
    toast.error("Invalid : Try again!");
    
  })
}


  return (
    <div className='App'>
      <h1>MERN CRUD OPERATION</h1>
<div className='p-5 d-flex justify-content-center'>
  <Card className='p-5 shadow border-0' >
    <Form onSubmit={handleSubmit}>
      <h5>Registeration Form</h5>
      <Row>
        <Form.Label>Name:</Form.Label>
        <Form.Control 
        type='text'
        onChange={(e)=>setName(e.target.value)}
        required
        />
      </Row>
      <Row>
        <Form.Label>RollNo:</Form.Label>
        <Form.Control 
        type='number'
        onChange={(e)=>setRollno(e.target.value)}
        required

        />
      </Row>
      <Row>
        <Form.Label>Age:</Form.Label>
        <Form.Control 
        type='number'
        onChange={(e)=>setAge(e.target.value)}
        required

        />
      </Row>
      <Row className='mt-3'>
        <Button type='submit' size='sm'>Submit</Button>
      </Row>
    </Form>
  </Card>
  <Card className='p-5 ms-5 shadow border-0'>
    <Form onSubmit={handleUpdate}>
      <h5>Update Form</h5>
      <Row>
        <Form.Label>Id:</Form.Label>
        <Form.Control 
        type='text'
        onChange={(e)=>setId(e.target.value)}
        required
        />
      </Row>
      <Row>
        <Form.Label>Name:</Form.Label>
        <Form.Control 
        type='text'
        onChange={(e)=>setName(e.target.value)}
        required
        />
      </Row>
      <Row>
        <Form.Label>RollNo:</Form.Label>
        <Form.Control 
        type='number'
        onChange={(e)=>setRollno(e.target.value)}
        required
        />
      </Row>
      <Row>
        <Form.Label>Age:</Form.Label>
        <Form.Control 
        type='number'
        onChange={(e)=>setAge(e.target.value)}
        required
        />
      </Row>
      <Row className='mt-3'>
        <Button type='submit' size='sm' className='bg-info border-0' >Update</Button>
      </Row>
    </Form>
  </Card>
</div>
      <div className='p-5'>
        <Table hover striped bordered>
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>RollNo</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {All?.map((item)=>(
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.rollno}</td>
                  <td>{item.age}</td>
                  <td>
                    <Button type='submit' className='bg-danger border-0' size='sm'
                    onClick={()=>handleDelete(item._id)}
                    >Delete</Button>
                  </td>

                </tr>
              ))}

            </tbody>

        </Table>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Crud
