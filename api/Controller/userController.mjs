import bcrypt from "bcryptjs";
import User from "../models/user.mjs";
import "dotenv/config";
// import userSchema from "../schema/userSchema.mjs";
import jwt from "jsonwebtoken";


const userLogin = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user,"db user")
    if (user) {
      const checkPassword = bcrypt.compareSync(password, user.password);
      console.log(checkPassword,"checkPassowrd")
      if (checkPassword) {
        console.log(process.env.JWT_SECRET_KEY)
        var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res
          .status(200)
          .json({ status: 200, message: "Login Successfull", token,user });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "Incorrect Password" });
      }
    } else {
      res
        .status(404)
        .json({ status: 404, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message, status: 500 });
  }
};

const add_User = async (req, res) => {
  if (!req.body) {
    return req.status(400).json({ message: "Bad request" });
  }
  try {
    const password = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({...req.body,password});
    // const newUser = await User.create({ ...user, password: password });
    var token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY);

    res.status(201).json({
      message: "User created successfully",
      user: {token, id: user.id, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, status: 500 });
  }
};

const all_Users = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err, status: 500 });
  }
};

const delete_User = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err, status: 500 });
  }
};

const edit_User = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if(user){
      res.status(200).json({ message: "User updated successfully", user });
    }else{
      res.status(404).json({ error: "User not found", status: 404 });
    }
   
  } catch (err) {
    res.status(500).json({ error: err.message, status: 500 });
  }
};

export {userLogin,add_User, all_Users, delete_User, edit_User };




