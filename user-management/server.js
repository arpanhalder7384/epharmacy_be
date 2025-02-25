const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/db");
const userRoutes = require("./routes/userRoutes");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const Cid = require('uuid').v4();
const consul = require('consul')();
const swaggerUi=require("swagger-ui-express");
const swaggerFile=require("./swagger_output.json")

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(loggerMiddleware);

app.use("/customer-api", userRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.get("/", (req, res) => {
    res.send("User Management Service Running...");
});


const port = process.env.NODE_PORT || 5001;
const hostname = '127.0.0.1';
const CONSULE_ID = "userManagementMS"

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
    }, 3 * 1000);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
