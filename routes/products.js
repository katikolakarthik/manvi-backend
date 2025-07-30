const express = require('express');
const { body, query } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  addProductReview,
  getProductReviews,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  initializeData,
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem
} = require('../controllers/products');

const router = express.Router();

// Public routes
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'other']).withMessage('Invalid category'),
  query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt']).withMessage('Invalid sort parameter'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number')
], validate, getProducts);

router.get('/featured', getFeaturedProducts);
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validate, searchProducts);

router.get('/category/:category', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 })
], validate, getProductsByCategory);

// Initialize data endpoint (for frontend)
router.post('/initialize-data', initializeData);

// Cart endpoints (simplified for demo)
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.delete('/cart/:id', removeFromCart);
router.put('/cart/:id', updateCartItem);

router.get('/:id', getProduct);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.use(protect);

router.post('/:id/reviews', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review cannot be more than 500 characters')
], validate, addProductReview);

// Admin routes
router.use(authorize('admin'));

router.route('/')
  .post([
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
    body('description').isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
    body('category').isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'other']).withMessage('Invalid category'),
    body('subcategory').optional().trim(),
    body('brand').optional().trim(),
    body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sku').optional().trim(),
    body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('tags').optional().isArray(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
    // Clothing specific fields
    body('material').optional().trim(),
    body('pattern').optional().trim(),
    body('color').optional().trim(),
    body('occasion').optional().trim(),
    body('sleeve_type').optional().trim(),
    body('neck_type').optional().trim(),
    body('fabric').optional().trim(),
    body('wash_care').optional().trim(),
    body('silhouette').optional().trim(),
    body('length').optional().trim(),
    body('sizes').optional().isArray(),
    body('size_guide').optional().isArray()
  ], validate, createProduct);

router.route('/:id')
  .put([
    body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
    body('description').optional().isLength({ min: 1, max: 500 }).withMessage('Description must be between 1 and 500 characters'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
    body('category').optional().isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'other']).withMessage('Invalid category'),
    body('subcategory').optional().trim(),
    body('brand').optional().trim(),
    body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sku').optional().trim(),
    body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('tags').optional().isArray(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
    body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
    // Clothing specific fields
    body('material').optional().trim(),
    body('pattern').optional().trim(),
    body('color').optional().trim(),
    body('occasion').optional().trim(),
    body('sleeve_type').optional().trim(),
    body('neck_type').optional().trim(),
    body('fabric').optional().trim(),
    body('wash_care').optional().trim(),
    body('silhouette').optional().trim(),
    body('length').optional().trim(),
    body('sizes').optional().isArray(),
    body('size_guide').optional().isArray()
  ], validate, updateProduct)
  .delete(deleteProduct);

router.post('/:id/upload-image', uploadProductImage);

module.exports = router; 