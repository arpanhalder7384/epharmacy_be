require('dotenv').config();
const express = require('express');
require('./config/db');
const logger = require('./middleware/logger');
const paymentRoutes = require('./routes/routes');
const Cid = require('uuid').v4();
const consul = require('consul')();
const swaggerUi=require("swagger-ui-express");
const swaggerFile=require("./swagger_output.json")
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/payment-api', paymentRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile))

const port = process.env.NODE_PORT || 5005;
const hostname = '127.0.0.1';
const CONSULE_ID = "paymentManagementMS"

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

app.listen(port, () => {
    console.log(`Payment Management Service running on port ${port}`);
});
