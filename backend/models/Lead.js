import mongoose from 'mongoose';

/**
 * Standard email format RFC 5322 validation regex.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Lead status lifecycle options matching frontend dashboard & pipeline filters.
 */
export const LEAD_STATUS_OPTIONS = Object.freeze([
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost'
]);

/**
 * Lead acquisition source channels matching frontend dropdown options.
 */
export const LEAD_SOURCE_OPTIONS = Object.freeze([
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other'
]);

/**
 * Lead Schema definition for Startup CRM Lite.
 * Tracks prospect interactions, qualification stages, source attribution, and assigned account owner.
 */
const leadSchema = new mongoose.Schema(
  {
    /**
     * Full contact name of the lead.
     * Trimmed string between 2 and 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    /**
     * Organization or company the prospect represents.
     * Required trimmed string for corporate account attribution.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },

    /**
     * Primary email contact for the lead.
     * Validated using RFC 5322 regex; indexed for fast search and duplicate checks.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return EMAIL_REGEX.test(value);
        },
        message: 'Email must be a valid email address'
      }
    },

    /**
     * Direct or mobile phone contact for the lead.
     * Optional trimmed string.
     */
    phone: {
      type: String,
      trim: true,
      default: ''
    },

    /**
     * Current stage of the lead in the sales pipeline.
     * Enforces strict enum values aligned with the React frontend pipeline boards.
     */
    status: {
      type: String,
      enum: {
        values: LEAD_STATUS_OPTIONS,
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    },

    /**
     * Inbound or outbound channel through which the lead was acquired.
     * Enforces strict enum values aligned with frontend analytics charts.
     */
    source: {
      type: String,
      enum: {
        values: LEAD_SOURCE_OPTIONS,
        message: '{VALUE} is not a valid lead source'
      },
      default: 'Website'
    },

    /**
     * General notes, meeting summaries, or context about the lead.
     * Optional string capped at 1000 characters to prevent database bloat.
     */
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: ''
    },

    /**
     * Expected revenue or deal value in currency units.
     * Mandatory numeric value; must be non-negative.
     */
    revenue: {
      type: Number,
      required: [true, 'Revenue is required'],
      min: [0, 'Revenue cannot be negative'],
      default: 0
    },

    /**
     * Foreign key reference to the User model who owns and manages this lead.
     * Enforces referential relationship and enables user-scoped data filtering.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual property: age
 * Computes the total elapsed age in days since the lead was created.
 * Used for sales velocity metrics and pipeline stagnation analytics.
 * 
 * @returns {number} Number of days since lead creation.
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffInMilliseconds = Date.now() - new Date(this.createdAt).getTime();
  const millisecondsInOneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffInMilliseconds / millisecondsInOneDay);
});

/**
 * Virtual property: value
 * Mirror alias for revenue to provide complete backward compatibility with analytics helpers.
 */
leadSchema.virtual('value').get(function () {
  return this.revenue !== undefined ? this.revenue : 0;
});

/**
 * Compound index on (owner, status)
 * Optimizes the most frequent query in CRM: fetching a sales rep's leads by pipeline status.
 */
leadSchema.index({ owner: 1, status: 1 });

/**
 * Single field index on email
 * Optimizes search, lookup, and deduplication queries across leads.
 */
leadSchema.index({ email: 1 });

/**
 * Lead Mongoose Model.
 */
export const Lead = mongoose.model('Lead', leadSchema);

/**
 * Exporting schema separately as required.
 */
export { leadSchema };

export default Lead;
