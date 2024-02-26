const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const userRoutes = require('./userRoutes');



const app = express();

app.use(bodyParser.json());


app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });