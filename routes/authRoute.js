import express from 'express';
import {
  forgotPasswordController,
  loginController,
  registerController,
  testController,
  updateProfileController,
} from '../controllers/authController.js';
import { isAdmin, requireSingnIn } from '../middlewares/authMiddleware.js';
//router object
const router = express.Router();

//REGISTER || METHOD
router.post('/register', registerController);
//LOGIN || METHOD
router.post('/login', loginController);
//FORGOT PASSWORD
router.post('/forgot-password', forgotPasswordController);
router.get('/test', requireSingnIn, isAdmin, testController);

//PROTECTED ROUTE FOR USER
router.get('/user-auth', requireSingnIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//PROTECTED ROUTE FOR ADMIN
router.get('/admin-auth', requireSingnIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
//UPDATE USER PROFILE
router.post('/update-profile', requireSingnIn, updateProfileController);
export default router;
