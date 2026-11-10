/**
 * Sends a standardized success JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {*} data - Payload data to return
 * @param {string} [message='Success'] - Descriptive message of the operation
 * @param {number} [statusCode=200] - HTTP status code (defaults to 200)
 * @returns {import('express').Response}
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized error JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {string} [message='Server error'] - Descriptive error message
 * @param {number} [statusCode=500] - HTTP status code (defaults to 500)
 * @param {*} [errors=null] - Optional detailed validation errors or error array
 * @returns {import('express').Response}
 */
export const errorResponse = (res, message = 'Server error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

/**
 * Sends a standardized paginated JSON response.
 * 
 * @param {import('express').Response} res - Express response object
 * @param {Array} data - Array of records for the requested page
 * @param {number} total - Total number of documents matching query
 * @param {number|string} page - Current page number
 * @param {number|string} limit - Maximum number of documents per page
 * @returns {import('express').Response}
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const numericTotal = Number(total) || 0;
  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 10;
  const totalPages = Math.ceil(numericTotal / numericLimit) || 0;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total: numericTotal,
      page: numericPage,
      limit: numericLimit,
      pages: totalPages
    }
  });
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse
};
