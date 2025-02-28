require("dotenv").config();
const express = require("express");
const cartRoutes = require("./routes/cartRoutes");
const connectDB = require("./config/db");
const cors = require("cors");
const loggerMiddleware = require("./middleware/logger");
const swaggerUi=require("swagger-ui-express")
const swaggerFile=require("./swagger_output.json")

const app = express();
connectDB(); 

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Use Routes
app.use("/cart-api", cartRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Start Server
const PORT =5003;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));









