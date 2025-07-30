const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserOrders
} = require('../controllers/users');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes (for authenticated user)
router.get('/profile', getUserProfile);
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim(),
  body('address.country').optional().trim()
], validate, updateUserProfile);

router.get('/orders', getUserOrders);

// Admin routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post([
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ], validate, createUser);

router.route('/:id')
  .get(getUser)
  .put([
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ], validate, updateUser)
  .delete(deleteUser);

module.exports = router; 