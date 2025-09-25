// Simple carbon emission tracking without external library
const mongoose = require('mongoose');

// Simple CO2 calculation constants (based on industry averages)
const CO2_PER_BYTE = 0.000000006; // 6 nanograms CO2 per byte (approximate)
const ENERGY_PER_BYTE = 0.0000001; // Energy consumption per byte

// Carbon Emission Schema
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

// Carbon tracking middleware
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

// Function to track carbon emission
const trackCarbonEmission = async (req, res, data, responseTime) => {
  try {
    // Calculate bytes transferred
    const requestSize = JSON.stringify(req.body || {}).length + (req.get('Content-Length') || 0);
    const responseSize = typeof data === 'string' ? data.length : JSON.stringify(data).length;
    const totalBytes = parseInt(requestSize) + parseInt(responseSize);
    
    // Calculate CO2 emissions using simple formula
    const co2InGrams = totalBytes * CO2_PER_BYTE; // Simple calculation
    
    // Estimate energy consumption (simplified calculation)
    const energyInJoules = totalBytes * ENERGY_PER_BYTE + responseTime * 0.01;
    
    // Create carbon emission record
    const carbonRecord = new CarbonEmission({
      endpoint: req.path,
      method: req.method,
      bytesTransferred: totalBytes,
      co2Emissions: co2InGrams,
      userAgent: req.get('User-Agent') || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress,
      responseTime: responseTime,
      energyConsumed: energyInJoules,
      sessionId: req.sessionID || 'anonymous'
    });
    
    // Save to database (don't await to avoid blocking the response)
    carbonRecord.save().catch(err => 
      console.warn('Failed to save carbon emission data:', err.message)
    );
    
  } catch (error) {
    console.warn('Carbon tracking error:', error.message);
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
    
    const emissions = await CarbonEmission.find({
      timestamp: { $gte: startTime }
    });
    
    const totalCO2 = emissions.reduce((sum, record) => sum + record.co2Emissions, 0);
    const totalBytes = emissions.reduce((sum, record) => sum + record.bytesTransferred, 0);
    const totalEnergy = emissions.reduce((sum, record) => sum + record.energyConsumed, 0);
    const avgResponseTime = emissions.length > 0 
      ? emissions.reduce((sum, record) => sum + record.responseTime, 0) / emissions.length 
      : 0;
    
    // Calculate equivalent metrics
    const treesNeeded = totalCO2 / 21000; // 21kg CO2 absorbed per tree per year
    const kmDriven = totalCO2 / 404; // 404g CO2 per km for average car
    
    return {
      timeframe,
      totalRequests: emissions.length,
      totalCO2Grams: Math.round(totalCO2 * 1000) / 1000,
      totalBytesTransferred: totalBytes,
      totalEnergyJoules: Math.round(totalEnergy * 1000) / 1000,
      averageResponseTime: Math.round(avgResponseTime),
      equivalentTreesNeeded: Math.round(treesNeeded * 10000) / 10000,
      equivalentKmDriven: Math.round(kmDriven * 1000) / 1000,
      co2PerRequest: emissions.length > 0 ? Math.round((totalCO2 / emissions.length) * 1000000) / 1000 : 0, // in milligrams
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
    breakdown[key].totalCO2 = Math.round(breakdown[key].totalCO2 * 1000) / 1000;
  });
  
  return Object.entries(breakdown)
    .sort((a, b) => b[1].totalCO2 - a[1].totalCO2)
    .slice(0, 10); // Top 10 endpoints
};

module.exports = {
  carbonTrackingMiddleware,
  getCarbonStats,
  CarbonEmission
};