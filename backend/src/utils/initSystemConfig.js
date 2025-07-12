const mongoose = require('mongoose');
const SystemConfig = require('../models/SystemConfig.model');
const User = require('../models/User.model');

// Initialize default system configurations
const initializeSystemConfig = async () => {
  try {
    // Find an admin user to use as the updatedBy
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    // Set default swap points if not already set
    const swapPointsConfig = await SystemConfig.findOne({ configKey: 'swapPoints' });
    if (!swapPointsConfig) {
      await SystemConfig.setConfig(
        'swapPoints', 
        25, 
        'Points awarded to both users for completing a swap',
        adminUser._id
      );
      console.log('✅ Default swap points (25) initialized');
    } else {
      console.log('📝 Swap points already configured:', swapPointsConfig.configValue);
    }

    // Set default redemption points if not already set
    const redemptionPointsConfig = await SystemConfig.findOne({ configKey: 'redemptionPoints' });
    if (!redemptionPointsConfig) {
      await SystemConfig.setConfig(
        'redemptionPoints', 
        25, 
        'Points awarded to item lister for point redemption',
        adminUser._id
      );
      console.log('✅ Default redemption points (25) initialized');
    } else {
      console.log('📝 Redemption points already configured:', redemptionPointsConfig.configValue);
    }

    console.log('🎉 System configuration initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing system config:', error);
  }
};

module.exports = { initializeSystemConfig };
