const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const setJWTcookie = require("../lib/utils/setJWTcookie");

const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: "invalid email address : signup failed" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "email already taken" });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "username already taken" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "password too short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      setJWTcookie(newUser._id, res);
      await newUser.save();
      res.json(newUser);
      // res.status(200).json({ message: "signup successful" });
    } else {
      res.status(400).json({ error: "new user not created" });
    }

    //
  } catch (err) {
    res.status(500).json({ error: "signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { loginText, password } = req.body;

    let username, email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailRegex.test(loginText) ? (email = loginText) : (username = loginText);

    const user =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ error: "bcrypt compare failed : login failed" });
        } else {
          if (result) {
            setJWTcookie(user._id, res);
            res.json(user);
            // res.status(200).json({ message: "login successful" });
          } else {
            res.status(400).json({ error: "wrong password : login failed" });
          }
        }
      });
    } else {
      return res
        .status(400)
        .json({ error: "user does not exist : login failed" });
    }

    //
  } catch (error) {
    res.status(500).json({ error: "login failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json({ error: "logout failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userID });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "getMe failed" });
  }
};

module.exports = { signup, login, logout, getMe };