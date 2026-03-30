const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Permission name is required'],
    trim: true,
  },
  resource: {
    type: String,
    required: [true, 'Resource name is required'],
    trim: true,
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
  },
});

// Compound unique index: one permission per resource+action pair
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('Permission', permissionSchema);
