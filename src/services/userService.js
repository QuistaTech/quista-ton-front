// userService.js

const BASE_URL = 'http://localhost:5000'; // Replace with your backend URL if needed

// Function to register or get a user by wallet address
export const registerUser = async (walletAddress) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error during user registration/retrieval');
    }
    return data; // Return the response data
  } catch (error) {
    // Handle any errors that occurred during the request
    return { success: false, message: error.message };
  }
};
