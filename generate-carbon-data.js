// Carbon Testing Script - Run this in browser console
// This will generate API traffic to populate the carbon dashboard

async function generateCarbonData() {
  console.log("🌱 Generating carbon emission data...");
  
  const API_BASE = "http://localhost:5000";
  
  // Test different API endpoints to generate varied carbon data
  const testRequests = [
    { url: `${API_BASE}/api/test`, method: 'GET', description: 'Basic test endpoint' },
    { url: `${API_BASE}/api/register`, method: 'GET', description: 'Fetch registered bodies' },
    { url: `${API_BASE}/api/carbon/stats?timeframe=1h`, method: 'GET', description: 'Carbon stats' },
    { url: `${API_BASE}/api/carbon/realtime`, method: 'GET', description: 'Real-time carbon data' }
  ];
  
  console.log("Making test requests to generate carbon data...");
  
  for (let i = 0; i < testRequests.length; i++) {
    const request = testRequests[i];
    try {
      console.log(`${i + 1}. ${request.description}...`);
      const response = await fetch(request.url, { 
        method: request.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log(`   ✅ Success (${data.length} bytes)`);
      } else {
        console.log(`   ⚠️  Response: ${response.status}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log("\n🔄 Refreshing carbon dashboard...");
  window.location.reload();
}

// Auto-run the function
generateCarbonData();