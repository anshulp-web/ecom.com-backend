import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ message: 'Name is Required' });
    }
    if (!email) {
      return res.send({ message: 'Email is Required' });
    }
    if (!password) {
      return res.send({ message: 'Password is Required' });
    }
    if (!address) {
      return res.send({ message: 'Address is Required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone is Required' });
    }
    if (!answer) {
      return res.send({ message: 'Security question is Required' });
    }
    //check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already registered user please login',
      });
    }
    //Hash Passwrd
    const hashedUserPassword = await hashPassword(password);

    //Save User
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      answer,
      password: hashedUserPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: 'User registration successfully',
      data: user,
    });
  } catch (error) {
    //console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      Error: error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: 'Invalid email or password',
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Not registered user',
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: 'Incorrect password',
      });
    }
    //Generate token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    return res.status(200).send({
      success: true,
      message: 'Login successfully',
      data: {
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;
    if (!email) {
      res.status(400).send({ message: 'Email is required' });
    }
    if (!answer) {
      res.status(400).send({ message: 'Answer is required' });
    }
    if (!newpassword) {
      res.status(400).send({ message: 'New password is required' });
    }
    //check email and answer
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Wrong Email or Answer',
      });
    }
    const hahed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hahed });
    res.status(200).send({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};
const testController = async (req, res) => {
  res.send('test route');
};

const updateProfileController = async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;
    //CHECK USER
    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
      const data = await userModel.findByIdAndUpdate(checkUser._id, {
        name,
        phone,
        address,
      });
      const result = await userModel.findById(checkUser._id);
      if (result) {
        res.status(201).send({
          success: true,
          message: 'Profile Updated Successfully',
          result,
        });
      }
    } else {
      res.status(404).send({
        success: false,
        message: 'Invalid user',
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in profile update',
      error,
    });
  }
};
export {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
};
