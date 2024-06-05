import express from 'express';
import { isAdmin, requireSingnIn } from '../middlewares/authMiddleware.js';
import {
  CategoryController,
  CreateCategoryController,
  DeleteCategoryController,
  SingleCategoryController,
  UpdateCategoryController,
} from '../controllers/CategoryController.js';

const router = express.Router();

//ROUTES
//CREATE CATEGORY
router.post(
  '/create-category',
  requireSingnIn,
  isAdmin,
  CreateCategoryController
);
//UPDATE CATEGORY
router.put(
  '/update-category/:id',
  requireSingnIn,
  isAdmin,
  UpdateCategoryController
);
//GET ALL CATEGORY
router.get('/get-category', CategoryController);
//GET SINGLE CATEGORY
router.get('/single-category/:slug', SingleCategoryController);
//DELETE CATEGORY
router.delete(
  '/delete-category/:id',
  requireSingnIn,
  isAdmin,
  DeleteCategoryController
);
export default router;
