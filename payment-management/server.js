require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const paymentRoutes = require('./routes/routes');

const app = express();
app.use(express.json());
app.use(logger);

connectDB();

app.use('/payment-api', paymentRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`Payment Management Service running on port ${PORT}`);
});
