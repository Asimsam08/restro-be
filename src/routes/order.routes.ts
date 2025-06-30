
import express from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticate, placeOrder);
router.get('/', authenticate, getOrders);
router.patch('/:id', authenticate, updateOrderStatus);

export default router;
