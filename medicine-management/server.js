require("dotenv").config();
const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
require("./config/db");
const loggerMiddleware = require("./middleware/logger");
const medicineRoutes = require("./routes/medicineRoutes");
const Cid = require('uuid').v4();
const consul = require('consul')();
const swaggerUi=require("swagger-ui-express");
const swaggerFile=require("./swagger_output.json")

const app = express();

app.use(cors({
    allowedHeaders:["Content-Type", "Authorization"],
    credentials:true
}));
app.use(express.json());
app.use(loggerMiddleware);
app.use("/medicine-api", medicineRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

const port = process.env.NODE_PORT || 5002;
const hostname = '127.0.0.1';
const CONSULE_ID = "medicineManagementMS"

const myService = {
    name: CONSULE_ID,
    address: hostname,
    port: port,
    id: Cid,
    check: {
        ttl: "10s",
        deregister_critical_service_after: '1m',
    },
}

consul.agent.service.register(myService, (err) => {
    setInterval(() => {
        consul.agent.check.pass({ id: `service:${Cid}` }, (err) => {
            if (err) throw new Error(err);
            console.log('Updated Consul - Health Status');
        });
    }, 10 * 1000);
});

app.listen(port, () => console.log(`Medicine API running on port ${port}`));
=======
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
>>>>>>> 5f13014 (first commit)
