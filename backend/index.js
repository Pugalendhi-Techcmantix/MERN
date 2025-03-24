const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables


// const crudRoute = require('./router/crud.router.js');
const roleRoute = require('./router/role.router.js');
const empRoute = require('./router/emp.router.js');
const ordersRoute = require('./router/orders.router.js');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    method: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

// Routes
// app.use('/crud', crudRoute);
app.use('/role', roleRoute);
app.use('/emp', empRoute);
app.use('/orders', ordersRoute);

// // Database Connection
// mongoose
//   .connect('mongodb://localhost:27017/CRUD')
//   .then(() => {
//     console.log('db connected');
//     app.listen(4000, () => {
//       console.log('server is running http://localhost:4000');
//     });
//   })
//   .catch(() => {
//     console.log('db failed');
//   });
// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Database connected');
    app.listen(4000, () => {
      console.log('🚀 Server running at http://localhost:4000');
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });