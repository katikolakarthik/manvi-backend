# Manvi Backend API

A complete Node.js backend API built with Express.js, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Register, Login, Profile)
- 🛍️ Product Management (CRUD operations)
- 📦 Order Management
- ⭐ Product Reviews & Ratings
- 🔍 Search & Filtering
- 📄 Pagination
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
- 📝 Input Validation
- 📊 Logging (Winston)
- 🧪 Testing Setup (Jest)
- 📁 File Upload Support
- 🚀 Production Ready

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **Logging**: winston
- **Testing**: Jest
- **Security**: helmet, cors, express-rate-limit

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd manvi/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/manvi
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password

### Users (Admin)
- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/:id` - Get user by ID
- `PUT /api/auth/users/:id` - Update user
- `DELETE /api/auth/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/:id/reviews` - Get product reviews

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/my-orders/:id` - Get user order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/my-orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID (Admin)
- `PUT /api/orders/:id` - Update order (Admin)
- `PATCH /api/orders/:id/status` - Update order status (Admin)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Health Check
- `GET /health` - Server health check

## Database Models

### User
- Basic info (name, email, password)
- Role-based access (user, admin)
- Address information
- Account status

### Product
- Product details (name, description, price)
- Category and brand
- Images and stock
- Ratings and reviews
- Discount and pricing

### Order
- Order items with quantities
- Shipping address
- Payment information
- Order status tracking
- Price calculations

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for data validation
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Request Validation**: Comprehensive input sanitization

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/manvi` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `MAX_FILE_SIZE` | Max file upload size | `5242880` (5MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `LOG_LEVEL` | Logging level | `info` |

## Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # Database connection
│   └── logger.js     # Winston logger setup
├── controllers/      # Route controllers
│   ├── auth.js       # Authentication controller
│   ├── users.js      # User management
│   ├── products.js   # Product management
│   └── orders.js     # Order management
├── middleware/       # Custom middleware
│   ├── auth.js       # Authentication middleware
│   ├── errorHandler.js # Error handling
│   ├── notFound.js   # 404 handler
│   ├── validate.js   # Validation middleware
│   └── upload.js     # File upload middleware
├── models/           # Mongoose models
│   ├── User.js       # User model
│   ├── Product.js    # Product model
│   └── Order.js      # Order model
├── routes/           # API routes
│   ├── auth.js       # Authentication routes
│   ├── users.js      # User routes
│   ├── products.js   # Product routes
│   └── orders.js     # Order routes
├── utils/            # Utility functions
│   ├── asyncHandler.js # Async error handler
│   └── responseHandler.js # Response utilities
├── tests/            # Test files
│   └── setup.js      # Test setup
├── uploads/          # File uploads directory
├── logs/             # Log files
├── server.js         # Main server file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests and linting
6. Submit a pull request

## License

This project is licensed under the MIT License. # manvi-backend
# manvi-backend
# manvi-backend
