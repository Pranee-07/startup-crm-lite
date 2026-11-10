import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Standard email format RFC 5322 validation regex.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Number of salt rounds for bcrypt password hashing.
 * 10 rounds provides a strong balance of cryptographic security and performance.
 */
const SALT_ROUNDS = 10;

/**
 * Allowed user role values within the CRM system.
 */
export const USER_ROLES = Object.freeze(['admin', 'user']);

/**
 * User Schema definition for Startup CRM Lite.
 * Handles authentication credentials, role-based access control, and account status.
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Full display name of the user.
     * Stored as a trimmed string between 2 and 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    /**
     * Unique email address used as the primary identifier for login.
     * Normalized to lowercase, trimmed, and validated against standard email format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return EMAIL_REGEX.test(value);
        },
        message: 'Email must be a valid email address'
      }
    },

    /**
     * Bcrypt-hashed password string.
     * Enforces a minimum plain text length of 6 characters before hashing in pre-save hook.
     * Never returned in JSON output.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },

    /**
     * Access control role for the user.
     * Determines permission levels across CRM modules ('admin' or 'user').
     */
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: '{VALUE} is not a valid role. Allowed roles are: admin, user'
      },
      default: 'user'
    },

    /**
     * Account activation flag.
     * Enables soft deactivation of accounts without hard deleting user records.
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      }
    }
  }
);

/**
 * Pre-save middleware hook to hash the plain text password before persisting to MongoDB Atlas.
 * Triggers only when the password field has been added or modified.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare a plain text candidate password with the stored bcrypt hash.
 * 
 * @param {string} candidatePassword - The plain text password submitted by the user.
 * @returns {Promise<boolean>} Resolves to true if passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Overrides default toJSON method to strip the password field from the returned object.
 * Ensures hashed passwords are never accidentally leaked in API responses or logs.
 * 
 * @returns {Object} User document object without the password field.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * User Mongoose Model.
 */
export const User = mongoose.model('User', userSchema);

/**
 * Exporting schema separately as required.
 */
export { userSchema };

export default User;
