/**
 * Global Express Error Handling Middleware.
 * Standardizes API error responses across the entire application and hides stack traces in production.
 * 
 * Must declare all 4 parameters (err, req, res, next) so Express recognizes it as an error handler.
 * 
 * @param {Error & { statusCode?: number, code?: number, errors?: Record<string, any> }} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose ValidationError → 400 with field-by-field error messages
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.keys(err.errors || {}).reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
  }
  // 2. Mongoose CastError (invalid ObjectId) → 404 "Resource not found"
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. MongoDB duplicate key (code 11000) → 409 "Email already exists"
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }
  // 4. JWT errors (JsonWebTokenError, TokenExpiredError) → 401
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError'
      ? 'Token expired, please log in again'
      : 'Invalid token, authorization denied';
  }
  // 5. Default fallback to 500 "Server error"
  else if (statusCode === 500) {
    message = 'Server error';
  }

  // Include stack traces only in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(isDevelopment && { stack: err.stack })
  });
};

export default errorHandler;
