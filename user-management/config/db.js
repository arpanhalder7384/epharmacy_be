const mongoose = require("mongoose");
const consul = require('consul')();

let config="";  
const dbConfigKey="ePharmacyDBConfig"

consul.kv.get(dbConfigKey,(err, result)=>{
  config=JSON.parse(result.Value)
  if(mongoose.connection.readyState===1){
    mongoose.connection.close;
  }
  connectDB()
})

const connectDB = async () => {
    try {
        console.log(config)
        await mongoose.connect(`${config.DataSource}://${config.DBHost}:${config.DBPort}/${config.ePharmacyUserDB}`);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

const watch = consul.watch({
    method: consul.kv.get,
    options: {
        key: dbConfigKey,
    },
    backoffFactor: 1000
})

watch.on("change", function (data, res) {
    config = JSON.parse(data.Value)
    if (mongoose.connection.readyState === 1) {
        mongoose.connection.close;
    }
    connectDB()
})
