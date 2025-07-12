const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  configKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  configValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Static method to get config value
systemConfigSchema.statics.getConfig = async function(key) {
  const config = await this.findOne({ configKey: key });
  return config ? config.configValue : null;
};

// Static method to set config value
systemConfigSchema.statics.setConfig = async function(key, value, description, updatedBy) {
  return await this.findOneAndUpdate(
    { configKey: key },
    { 
      configValue: value, 
      description: description || `Configuration for ${key}`,
      updatedBy 
    },
    { 
      upsert: true, 
      new: true 
    }
  );
};

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

module.exports = SystemConfig;
