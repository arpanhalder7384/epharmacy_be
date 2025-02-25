require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const orderRoutes = require('./routes/routes');

const app = express();
app.use(express.json());
app.use(logger);

connectDB();

app.use('/order-api', orderRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
    console.log(`Order Management Service running on port ${PORT}`);
});
