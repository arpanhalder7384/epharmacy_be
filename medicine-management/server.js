require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const loggerMiddleware = require("./middleware/logger");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use("/medicine-api", medicineRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Medicine API running on port ${PORT}`));
