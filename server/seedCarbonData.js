// Carbon Data Seeder - Run this to populate test data directly
const mongoose = require('mongoose');

// Use the same schema as the carbon tracker
const CarbonEmissionSchema = new mongoose.Schema({
  endpoint: String,
  method: String,
  bytesTransferred: Number,
  co2Emissions: Number,
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ipAddress: String,
  responseTime: Number,
  energyConsumed: Number,
  sessionId: String,
});

const CarbonEmission = mongoose.model("CarbonEmission", CarbonEmissionSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'your-mongo-uri-here');

async function seedCarbonData() {
  console.log("🌱 Seeding carbon emission data...");
  
  const sampleData = [];
  const endpoints = [
    '/api/register',
    '/api/signin',
    '/api/signup',
    '/api/test',
    '/api/carbon/stats'
  ];
  
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  
  // Generate 50 sample records
  for (let i = 0; i < 50; i++) {
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const bytes = Math.floor(Math.random() * 10000) + 100; // 100-10100 bytes
    
    sampleData.push({
      endpoint,
      method,
      bytesTransferred: bytes,
      co2Emissions: bytes * 0.000000006 * (1 + Math.random()), // Vary the emission slightly
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
      userAgent: 'Test Browser',
      ipAddress: '127.0.0.1',
      responseTime: Math.floor(Math.random() * 500) + 50, // 50-550ms
      energyConsumed: bytes * 0.0000001 + Math.random() * 0.1,
      sessionId: `test-session-${Math.floor(Math.random() * 100)}`
    });
  }
  
  try {
    await CarbonEmission.insertMany(sampleData);
    console.log(`✅ Successfully seeded ${sampleData.length} carbon emission records`);
    console.log("🎉 You can now see data in your carbon dashboard!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedCarbonData();