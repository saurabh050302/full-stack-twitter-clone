const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();
// const MONGO_URI = process.env.MONGO_URI;

const connectMongoDB = async (MONGO_URI) => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.log("Could not connect to mongoDB");
    process.exit(1);
  }
};

module.exports = connectMongoDB;
