const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    console.log("Could not connect to mongoDB");
    process.exit(1);
  }
};

module.exports = connectMongoDB;
