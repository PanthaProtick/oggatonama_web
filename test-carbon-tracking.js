// Carbon Emission Test Script
// This script demonstrates the carbon tracking functionality

const API_BASE = "http://localhost:5000";

// Test function to make API calls and demonstrate carbon tracking
async function testCarbonTracking() {
  console.log("🌱 Testing Carbon Emission Tracking System");
  console.log("=" .repeat(50));
  
  try {
    // Test 1: Check if backend is running
    console.log("\n1. Testing backend connection...");
    const testResponse = await fetch(`${API_BASE}/api/test`);
    if (testResponse.ok) {
      console.log("✅ Backend is running successfully");
    }
    
    // Test 2: Make several API calls to generate carbon data
    console.log("\n2. Generating carbon emission data...");
    
    // Simulate various types of requests
    const requests = [
      { endpoint: '/api/register', description: 'Fetch registered bodies' },
      { endpoint: '/api/test', description: 'Test endpoint call' },
      { endpoint: '/api/carbon/realtime', description: 'Real-time carbon data' }
    ];
    
    for (const request of requests) {
      try {
        const response = await fetch(`${API_BASE}${request.endpoint}`);
        console.log(`📊 ${request.description}: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      } catch (error) {
        console.log(`❌ ${request.description}: Failed`);
      }
    }
    
    // Test 3: Wait for data to be processed and fetch carbon stats
    console.log("\n3. Fetching carbon emission statistics...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    const carbonStatsResponse = await fetch(`${API_BASE}/api/carbon/stats?timeframe=1h`);
    if (carbonStatsResponse.ok) {
      const carbonData = await carbonStatsResponse.json();
      console.log("✅ Carbon statistics retrieved successfully");
      console.log("\n📈 Carbon Emission Summary:");
      console.log(`   • Total requests: ${carbonData.data.totalRequests}`);
      console.log(`   • Total CO₂: ${carbonData.data.totalCO2Grams.toFixed(3)} grams`);
      console.log(`   • Average per request: ${carbonData.data.co2PerRequest.toFixed(3)} mg`);
      console.log(`   • Data transferred: ${carbonData.data.totalBytesTransferred} bytes`);
      console.log(`   • Energy consumed: ${carbonData.data.totalEnergyJoules.toFixed(2)} Joules`);
    } else {
      console.log("❌ Failed to fetch carbon statistics");
    }
    
    // Test 4: Check real-time carbon data
    console.log("\n4. Testing real-time carbon monitoring...");
    const realtimeResponse = await fetch(`${API_BASE}/api/carbon/realtime`);
    if (realtimeResponse.ok) {
      const realtimeData = await realtimeResponse.json();
      console.log("✅ Real-time carbon data retrieved");
      console.log(`   • Current emission per request: ${realtimeData.data.currentEmissionPerRequest.toFixed(3)} mg`);
      console.log(`   • Status: ${realtimeData.data.status.toUpperCase()}`);
      console.log(`   • Requests last hour: ${realtimeData.data.requestsLastHour}`);
    }
    
    console.log("\n🎉 Carbon tracking system test completed successfully!");
    console.log("\n💡 You can now:");
    console.log("   • Visit http://localhost:3000/carbon to see the dashboard");
    console.log("   • Check the carbon widget on the homepage");
    console.log("   • Monitor real-time emissions as you use the app");
    
  } catch (error) {
    console.error("❌ Carbon tracking test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("   • Make sure the backend server is running on port 5000");
    console.log("   • Check if MongoDB connection is established");
    console.log("   • Verify the @tgwf/co2 package is installed");
  }
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  // Running in Node.js environment
  const fetch = require('node-fetch');
  testCarbonTracking();
} else {
  // Running in browser environment
  console.log("This test script is designed to run in Node.js");
  console.log("Open browser console and run: testCarbonTracking()");
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.testCarbonTracking = testCarbonTracking;
}