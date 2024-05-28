const express = require("express");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const connectMongoDB = require("./database/connectMongo");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/api/auth", authRoutes);

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is listening to port : ${PORT}`);
  connectMongoDB();
});
