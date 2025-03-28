const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import Socket.IO
const cors = require('cors');
const dotenv = require('dotenv');

const roleRoute = require('./router/role.router.js');
const empRoute = require('./router/emp.router.js');
const ordersRoute = require('./router/orders.router.js');
const productsRoutes = require('./router/products.router.js');

dotenv.config(); // Load environment variables
const app = express();
// const server = http.createServer(app); // ✅ Create an HTTP server
// // ✅ Initialize Socket.IO with the server
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "*", // React frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
//   transports: ["websocket", "polling"],
// });

app.use(express.json());

// ✅ Corrected CORS Configuration (Allow XHR & Credentials)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // Allow frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  })
);

// Routes
app.use('/role', roleRoute);
app.use('/emp', empRoute);
app.use('/orders', ordersRoute);
app.use('/products', productsRoutes);
app.get("/test", async (req, res) => {
  try {
      res.send("API is working!");
  } catch (error) {
      res.status(500).send("Error occurred");
  }
});

// ✅ Socket.IO Connection
// io.on("connection", (socket) => {
//   console.log("⚡ New client connected:", socket.id);

//   socket.on("message", (data) => {
//     // console.log("📩 Message received:", data);
//     io.emit("message", data); // Broadcast to all clients
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//   });
// });

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

  // Export the Express app (VERY IMPORTANT for Vercel)
module.exports = app;

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


// server.listen(4000, () => {
//   console.log('Server running on http://localhost:4000');
// });