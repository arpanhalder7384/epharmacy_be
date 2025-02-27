require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const loggerMiddleware = require("./middleware/logger");
const swaggerUi=require("swagger-ui-express")
const medicineRoutes = require("./routes/medicineRoutes");
const swaggerFile=require("./swagger_output.json")

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use("/medicine-api", medicineRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Medicine API running on port ${PORT}`));
