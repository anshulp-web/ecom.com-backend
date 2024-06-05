import express from 'express';
import { isAdmin, requireSingnIn } from '../middlewares/authMiddleware.js';
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllProductsCotnroller,
  getSingleProductController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoController,
  searchProductController,
  similarProductController,
  updateProductController,
} from '../controllers/ProductController.js';
import formidable from 'express-formidable';
const router = express.Router();

//ROUTES

//CREATE PRODUCT
router.post(
  '/create-product',
  requireSingnIn,
  isAdmin,
  formidable(),
  createProductController
);

//UPDATE PRODUCT
router.put(
  '/update-product/:id',
  requireSingnIn,
  isAdmin,
  formidable(),
  updateProductController
);

//GET ALL PRODUCTS
router.get('/products', getAllProductsCotnroller);

//GET SINGLE PRODUCT
router.get('/get-single-product/:slug', getSingleProductController);

//GET PHOTO
router.get('/product-photo/:pid', productPhotoController);

//DELETE PRODUCT
router.delete('/delete-product/:id', deleteProductController);

//PRODUCT FILTER
router.post('/filter-product', productFilterController);

//PRODUCT COUNT
router.get('/product-count', productCountController);

//PRODUCT PER PAGE
router.get('/product-list/:page', productListController);

//PRODUCT SEARCH
router.get('/search/:keyword', searchProductController);

//GET SIMILAR PRODUCT
router.get('/get-similar-product/:cid/:pid', similarProductController);

//PAYMENT ROUTES
//TOKEN
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSingnIn, brainTreePaymentController);

export default router;
