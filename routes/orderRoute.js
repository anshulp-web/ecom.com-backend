import express from 'express';
import { isAdmin, requireSingnIn } from '../middlewares/authMiddleware.js';
import {
  getAllOrdersController,
  getOrdersController,
  orderStatusController,
} from '../controllers/orderController.js';

const router = express.Router();

//FETCH ORDERS

router.get('/get-orders', requireSingnIn, getOrdersController);

//ALL ORDERS
router.get('/all-orders', requireSingnIn, isAdmin, getAllOrdersController);

// ORDERS STATUS UPDATE
router.put(
  '/order-status/:orderId',
  requireSingnIn,
  isAdmin,
  orderStatusController
);

export default router;
