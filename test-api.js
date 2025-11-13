// Test script to check if API is running
const testAPI = async () => {
    const baseURL = 'http://localhost:3000/api/v1';
    
    try {
        console.log('Testing API connection...');
        
        // Test health check
        const healthResponse = await fetch(`${baseURL}/../index`);
        console.log('Health check response:', healthResponse.status);
        
        // Test registration endpoint
        const testUser = {
            username: 'testuser123',
            password: 'password123',
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            address: '123 Test Street, Test City'
        };
        
        console.log('Testing registration with:', testUser);
        
        const response = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const result = await response.text();
        console.log('Response body:', result);
        
        if (response.ok) {
            console.log('✅ API is working!');
        } else {
            console.log('❌ API error:', response.status, result);
        }
        
    } catch (error) {
        console.error('❌ Network error:', error);
        console.log('Make sure the API server is running on port 5000');
    }
};

// Run the test
testAPI();
