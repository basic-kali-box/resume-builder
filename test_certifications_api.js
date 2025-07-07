// Test script to verify certifications API
const axios = require('axios');

const testCertificationsAPI = async () => {
  try {
    // First, let's test with a valid resume ID
    // You'll need to replace this with an actual resume ID from your database
    const resumeId = "675b123456789012345678ab"; // Replace with actual ID
    
    const testData = {
      data: {
        certifications: [
          {
            name: "AWS Certified Solutions Architect",
            issuingOrganization: "Amazon Web Services",
            issueDate: "2024-01",
            expirationDate: "2027-01"
          }
        ]
      }
    };

    console.log("Testing certifications API...");
    console.log("Resume ID:", resumeId);
    console.log("Data:", JSON.stringify(testData, null, 2));

    const response = await axios.put(
      `http://localhost:5001/api/resumes/updateResume?id=${resumeId}`,
      testData.data,
      {
        headers: {
          'Content-Type': 'application/json',
          // You'll need to add authentication headers here
          // 'Authorization': 'Bearer your-jwt-token'
        }
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

// Uncomment to run the test
// testCertificationsAPI();

console.log("Test script created. Update the resumeId and authentication, then run with: node test_certifications_api.js");
