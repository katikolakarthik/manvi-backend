const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Build sort
    let sort = '-createdAt';
    if (req.query.sort) {
      sort = req.query.sort;
    }

    const products = await Product.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sort);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'ratings.user',
      select: 'name avatar'
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image
// @route   POST /api/products/:id/upload-image
// @access  Private/Admin
const uploadProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // TODO: Implement file upload logic
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Image upload functionality to be implemented'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      review: req.body.review
    };

    product.ratings.push(review);
    product.calculateAverageRating();

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'ratings.user',
        select: 'name avatar'
      })
      .select('ratings');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      count: product.ratings.length,
      data: product.ratings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    }).limit(10);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const products = await Product.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: req.query.q, $options: 'i' } },
            { description: { $regex: req.query.q, $options: 'i' } },
            { brand: { $regex: req.query.q, $options: 'i' } }
          ]
        }
      ]
    })
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    const total = await Product.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: req.query.q, $options: 'i' } },
            { description: { $regex: req.query.q, $options: 'i' } },
            { brand: { $regex: req.query.q, $options: 'i' } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const products = await Product.find({
      category: req.params.category,
      isActive: true
    })
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    const total = await Product.countDocuments({
      category: req.params.category,
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize data for frontend
// @route   POST /api/products/initialize-data
// @access  Public
const initializeData = async (req, res, next) => {
  try {
    // Check if products exist, if not add sample data
    const productCount = await Product.countDocuments();
    
    if (productCount === 0) {
      // Import and run the sample products script
      const addSampleProducts = require('../scripts/addSampleProducts');
      console.log('No products found, initializing with sample data...');
    }
    
    res.status(200).json({
      success: true,
      message: 'Data initialized successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart items (simplified for demo)
// @route   GET /api/products/cart
// @access  Public
const getCart = async (req, res, next) => {
  try {
    // For demo purposes, return empty cart
    // In a real app, this would get cart from session/database
    res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (simplified for demo)
// @route   POST /api/products/cart
// @access  Public
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity, size } = req.body;
    
    // For demo purposes, just return success
    // In a real app, this would add to session/database
    res.status(200).json({
      success: true,
      message: 'Item added to cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart (simplified for demo)
// @route   DELETE /api/products/cart/:id
// @access  Public
const removeFromCart = async (req, res, next) => {
  try {
    // For demo purposes, just return success
    res.status(200).json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item (simplified for demo)
// @route   PUT /api/products/cart/:id
// @access  Public
const updateCartItem = async (req, res, next) => {
  try {
    // For demo purposes, just return success
    res.status(200).json({
      success: true,
      message: 'Cart item updated'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
}; 