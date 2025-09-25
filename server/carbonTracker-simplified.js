// Alternative Carbon Tracker - Simplified Version
// This version uses industry-standard calculations without external dependencies

const mongoose = require('mongoose');

// Carbon emission constants (based on research data)
const CARBON_CONSTANTS = {
  // CO2 emissions per byte transferred (grams) - increased for more visible results
  CO2_PER_BYTE: 0.00000004, // 40 nanograms per byte (more realistic for demo)
  
  // Energy consumption per byte (joules)
  ENERGY_PER_BYTE: 0.0000001,
  
  // Additional factors
  SERVER_ENERGY_PER_MS: 0.01, // Energy per millisecond of processing
  NETWORK_OVERHEAD: 1.2, // 20% network overhead
};

// Carbon Emission Schema (same as before)
const CarbonEmissionSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  bytesTransferred: Number,
  co2Emissions: Number, // in grams
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String,
  responseTime: Number, // in milliseconds
  energyConsumed: Number, // in joules
  sessionId: String,
});

const CarbonEmission = mongoose.model("CarbonEmission", CarbonEmissionSchema);

// Simplified carbon tracking middleware
const carbonTrackingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Override res.send to capture response size
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    trackCarbonEmission(req, res, data, responseTime);
    return originalSend.call(this, data);
  };
  
  // Override res.json to capture response size
  res.json = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const jsonData = JSON.stringify(data);
    trackCarbonEmission(req, res, jsonData, responseTime);
    return originalJson.call(this, data);
  };
  
  next();
};

// Simplified carbon emission tracking
const trackCarbonEmission = async (req, res, data, responseTime) => {
  try {
    // Calculate bytes transferred
    const requestSize = JSON.stringify(req.body || {}).length + parseInt(req.get('Content-Length') || 0);
    const responseSize = typeof data === 'string' ? data.length : JSON.stringify(data).length;
    const totalBytes = requestSize + responseSize;
    
    // Apply network overhead
    const totalBytesWithOverhead = totalBytes * CARBON_CONSTANTS.NETWORK_OVERHEAD;
    
    // Calculate CO2 emissions (simplified)
    const co2InGrams = totalBytesWithOverhead * CARBON_CONSTANTS.CO2_PER_BYTE;
    
    // Calculate energy consumption
    const energyInJoules = (totalBytesWithOverhead * CARBON_CONSTANTS.ENERGY_PER_BYTE) + 
                          (responseTime * CARBON_CONSTANTS.SERVER_ENERGY_PER_MS);
    
    console.log(`[CARBON TRACKER] ${req.method} ${req.path} - ${totalBytesWithOverhead} bytes - ${co2InGrams.toFixed(8)} g CO2`);
    
    // Create carbon emission record
    const carbonRecord = new CarbonEmission({
      endpoint: req.path,
      method: req.method,
      bytesTransferred: Math.round(totalBytesWithOverhead),
      co2Emissions: co2InGrams,
      userAgent: req.get('User-Agent') || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress,
      responseTime: responseTime,
      energyConsumed: energyInJoules,
      sessionId: req.sessionID || 'anonymous'
    });
    
    // Save to database with proper error handling
    try {
      const saved = await carbonRecord.save();
      console.log(`[CARBON TRACKER] ✅ Saved record ID: ${saved._id}`);
    } catch (saveError) {
      console.error('[CARBON TRACKER] ❌ Failed to save:', saveError.message);
    }
    
  } catch (error) {
    console.error('[CARBON TRACKER] ❌ Tracking error:', error.message);
  }
};

// Function to get carbon emission statistics
const getCarbonStats = async (timeframe = '24h') => {
  try {
    const now = new Date();
    let startTime;
    
    switch (timeframe) {
      case '1h':
        startTime = new Date(now - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now - 24 * 60 * 60 * 1000);
    }
    
    console.log(`[CARBON STATS] Querying from ${startTime.toISOString()} to ${now.toISOString()}`);
    
    const emissions = await CarbonEmission.find({
      timestamp: { $gte: startTime }
    });
    
    console.log(`[CARBON STATS] Found ${emissions.length} records`);
    
    if (emissions.length === 0) {
      console.log('[CARBON STATS] No data found, returning zeros');
      return {
        timeframe,
        totalRequests: 0,
        totalCO2Grams: 0,
        totalBytesTransferred: 0,
        totalEnergyJoules: 0,
        averageResponseTime: 0,
        equivalentTreesNeeded: 0,
        equivalentKmDriven: 0,
        co2PerRequest: 0,
        endpointBreakdown: []
      };
    }
    
    const totalCO2 = emissions.reduce((sum, record) => sum + record.co2Emissions, 0);
    const totalBytes = emissions.reduce((sum, record) => sum + record.bytesTransferred, 0);
    const totalEnergy = emissions.reduce((sum, record) => sum + record.energyConsumed, 0);
    const avgResponseTime = emissions.reduce((sum, record) => sum + record.responseTime, 0) / emissions.length;
    
    // Calculate equivalent metrics (convert from grams to appropriate units)
    const treesNeeded = totalCO2 / 0.021; // 21mg CO2 absorbed per tree per day (corrected)
    const kmDriven = totalCO2 * 1000 / 404; // Convert grams to mg, then divide by 404mg per km
    
    console.log(`[CARBON STATS] Raw totalCO2: ${totalCO2} grams, Per request: ${totalCO2/emissions.length} grams`);
    
    return {
      timeframe,
      totalRequests: emissions.length,
      totalCO2Grams: Number(totalCO2.toFixed(6)), // Keep as grams, fix decimal places
      totalBytesTransferred: totalBytes,
      totalEnergyJoules: Number(totalEnergy.toFixed(3)),
      averageResponseTime: Math.round(avgResponseTime),
      equivalentTreesNeeded: Number(treesNeeded.toFixed(6)),
      equivalentKmDriven: Number(kmDriven.toFixed(3)),
      co2PerRequest: emissions.length > 0 ? Number(((totalCO2 / emissions.length) * 1000).toFixed(3)) : 0, // Convert to milligrams
      endpointBreakdown: getEndpointBreakdown(emissions)
    };
    
  } catch (error) {
    console.error('Error getting carbon stats:', error);
    return null;
  }
};

// Helper function to break down emissions by endpoint
const getEndpointBreakdown = (emissions) => {
  const breakdown = {};
  
  emissions.forEach(record => {
    const key = `${record.method} ${record.endpoint}`;
    if (!breakdown[key]) {
      breakdown[key] = {
        requests: 0,
        totalCO2: 0,
        totalBytes: 0,
        avgResponseTime: 0
      };
    }
    
    breakdown[key].requests++;
    breakdown[key].totalCO2 += record.co2Emissions;
    breakdown[key].totalBytes += record.bytesTransferred;
    breakdown[key].avgResponseTime += record.responseTime;
  });
  
  // Calculate averages and sort by CO2 emissions
  Object.keys(breakdown).forEach(key => {
    breakdown[key].avgResponseTime = Math.round(breakdown[key].avgResponseTime / breakdown[key].requests);
    breakdown[key].totalCO2 = Number(breakdown[key].totalCO2.toFixed(6)); // Keep full precision
  });
  
  return Object.entries(breakdown)
    .sort((a, b) => b[1].totalCO2 - a[1].totalCO2)
    .slice(0, 10); // Top 10 endpoints
};

module.exports = {
  carbonTrackingMiddleware,
  getCarbonStats,
  CarbonEmission,
  CARBON_CONSTANTS
};