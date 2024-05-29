const express = require("express");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const connectMongoDB = require("./database/connectMongo");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is listening to port : ${PORT}`);
  connectMongoDB();
});
