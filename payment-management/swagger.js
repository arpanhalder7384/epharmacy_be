const swaggerAutogen = require("swagger-autogen")
const outputFile = "./swagger_output.json"
const endpointsFiles = ["./routes/routes.js"]

swaggerAutogen(outputFile, endpointsFiles)