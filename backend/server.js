const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const notificationRoutes = require("./routes/notification.routes");

const connectMongoDB = require("./database/connectMongo");

dotenv.config();
// dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// app.get("/api/ping", (req, res) => {
//   res.json({ message: "this is response" });
//   console.log("requested");
// });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is listening to port : ${PORT}`);
  connectMongoDB();
});
