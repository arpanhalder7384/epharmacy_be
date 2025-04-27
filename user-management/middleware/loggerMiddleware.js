const logger = require("../utils/logger");

const loggerMiddleware = (req, res, next) => {
    const { method, originalUrl, body } = req;
    
    logger.info(`Request: ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`);

    const oldSend = res.send;
    res.send = function (data) {
        logger.info(`Response: ${method} ${originalUrl} - Status: ${res.statusCode} - Data: ${data}`);
        oldSend.apply(res, arguments);
    };

    next();
};

module.exports = loggerMiddleware;
