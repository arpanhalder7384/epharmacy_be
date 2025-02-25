const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(loggerMiddleware);

app.use("/customer-api/customer", userRoutes);

app.get("/", (req, res) => {
    res.send("User Management Service Running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
