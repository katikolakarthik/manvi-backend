const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getMyOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/orders');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/my-orders', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
], validate, getMyOrders);

router.get('/my-orders/:id', getOrderById);

router.post('/', [
  body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('orderItems.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']).withMessage('Invalid payment method'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot be more than 500 characters'),
  body('couponCode').optional().trim()
], validate, createOrder);

router.put('/my-orders/:id/cancel', cancelOrder);

// Admin routes
router.use(authorize('admin'));

router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  query('sort').optional().isIn(['createdAt', '-createdAt', 'totalPrice', '-totalPrice']).withMessage('Invalid sort parameter'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date')
], validate, getOrders);

router.get('/:id', getOrder);

router.put('/:id', [
  body('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('trackingNumber').optional().trim(),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot be more than 500 characters'),
  body('isPaid').optional().isBoolean().withMessage('isPaid must be a boolean'),
  body('isDelivered').optional().isBoolean().withMessage('isDelivered must be a boolean'),
  body('shippingAddress.street').optional().trim(),
  body('shippingAddress.city').optional().trim(),
  body('shippingAddress.state').optional().trim(),
  body('shippingAddress.zipCode').optional().trim(),
  body('shippingAddress.country').optional().trim()
], validate, updateOrder);

router.patch('/:id/status', [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
  body('trackingNumber').optional().trim(),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot be more than 500 characters')
], validate, updateOrderStatus);

router.delete('/:id', deleteOrder);

module.exports = router; 