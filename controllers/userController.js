const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      message: "All users data",
      sucess: true,
      users,
      userCount: users.length,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).send({
      sucess: false,
      message: "Error in Get All Users",
      error,
    });
  }
};

exports.registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        sucess: false,
        message: "Please Fill all details",
      });
    }
    // Existing User
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(401).send({
        message: "User already exisits",
        sucess: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // save new user
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).send({
      sucess: true,
      message: "New User Created",
      user,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({
      message: "Error In Register Callback",
      sucess: false,
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(401).send({
        message: "Please provide email or password",
        sucess: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        sucess: false,
        message: "email is not registered",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        sucess: false,
        message: "Invalid username or password",
      });
    }
    return res.status(200).send({
      message: "Login Sucessful!!",
      user,
      sucess: true,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500).send({
      sucess: false,
      message: "Error in Login Callback",
      error,
    });
  }
};
