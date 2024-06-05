import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//Protected routes

export const requireSingnIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//Admin Access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (user.role == 1) {
      next();
    } else {
      return res.json({
        success: false,
        message: 'not admin',
      });
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: 'Error in admin middleware',
    });
  }
};
