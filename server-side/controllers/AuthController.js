import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registering a new user
export const registerUser = async (req, res) => {
 
  //Creating a salt and hashing the password for password encryption.
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req?.body.password, salt); //Salt has been added to the password.
  req.body.password = hashedPass
  const newUser = new UserModel(req.body);
  const {username} = req.body
  try {
    // Checking if this user already exists in the database.
    const oldUser = await UserModel.findOne({ username });
    if (oldUser)
      return res.status(400).json({ message: "Username already exists!" });

    // Validating the user's identity using JWT Token to allow them access to the data.
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1hr" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("Incorrect Credentials!");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
