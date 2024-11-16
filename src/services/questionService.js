// questionService.js

const BASE_URL = 'http://localhost:5000'; // Replace with your backend URL if different

// Function to fetch a question for a specific wallet address using the feed_question endpoint
export const feedQuestion = async (walletAddress) => {
  try {
    const response = await fetch(`${BASE_URL}/questions/feed_question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching the next question');
    }
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function to check if the answer for a question is correct using the answer endpoint

export const answerQuestion = async (walletAddress, questionId, selectedOption) => {
    try {
      const response = await fetch(`${BASE_URL}/questions/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          wallet_address: walletAddress, 
          question_id: questionId, 
          answer: selectedOption // Ensure the request uses "answer" as per your backend specification
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error checking answer');
      }
  
      // Return response data with specific fields as per new backend logic
      return {
        success: data.success,
        isCorrectAnswer: data.isCorrectAnswer,
        tokensAdded: data.tokensAdded,
        user: {
          wallet_address: data.user.wallet_address,
          daily_right: data.user.daily_right,
          eraser: data.user.eraser,
          balance: data.user.balance,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  