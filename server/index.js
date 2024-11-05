require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./dbConnection/connection');
const userRoutes = require('./Routers/userRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());


connectDB();


app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
