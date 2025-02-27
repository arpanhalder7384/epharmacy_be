const swaggerAutogen = require("swagger-autogen")
const outputFile = "./swagger_output.json"
const endpointsFiles = ["./routes/medicineRoutes.js"]

swaggerAutogen(outputFile, endpointsFiles)