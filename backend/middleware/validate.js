import { validationResult } from 'express-validator';

/**
 * Higher-order middleware factory for request validation using express-validator.
 * 
 * Executes an array of validation chains in parallel, collects any validation failures,
 * and standardizes the error output into `{ success: false, errors: [{ field, message }] }`.
 * 
 * If validation passes, control proceeds cleanly to the next middleware or controller handler.
 * 
 * @param {Array<import('express-validator').ContextRunner>} validations - Array of express-validator check rules
 * @returns {import('express').RequestHandler} Express middleware handler
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation rules against incoming request
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    // If no validation errors exist, proceed to route controller
    if (errors.isEmpty()) {
      return next();
    }

    // Map errors into standard field/message objects
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};

export default validate;
