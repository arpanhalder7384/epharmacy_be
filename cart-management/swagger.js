const swaggerAutogen = require("swagger-autogen")
const outputFile = "./swagger_output.json"
const endpointsFiles = ["./routes/cartRoutes.js"]

swaggerAutogen(outputFile, endpointsFiles)