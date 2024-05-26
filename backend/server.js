const express = require("express");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth.routes");
const connectMongoDB = require("./database/connectMongo");

const app = express();

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.use("/api/auth", authRoutes);

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.listen(PORT, () => {
  console.log(`server is listening to port : ${PORT}`);
  connectMongoDB(MONGO_URI);
});
