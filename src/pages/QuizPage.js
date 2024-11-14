import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const questions = [
    // Easy
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4", level: "easy", time: 30 },
    { question: "What is 5 - 3?", options: ["2", "3", "4", "1"], answer: "2", level: "easy", time: 30 },
    { question: "What is 7 + 3?", options: ["9", "10", "11", "12"], answer: "10", level: "easy", time: 30 },
    { question: "What is 6 / 2?", options: ["3", "4", "5", "6"], answer: "3", level: "easy", time: 30 },
    { question: "What is 8 * 1?", options: ["8", "9", "10", "11"], answer: "8", level: "easy", time: 30 },
    // Medium
    { question: "What is 12 - 5?", options: ["6", "7", "8", "5"], answer: "7", level: "medium", time: 60 },
    { question: "What is 15 + 7?", options: ["21", "22", "23", "24"], answer: "22", level: "medium", time: 60 },
    { question: "What is 9 * 3?", options: ["27", "28", "29", "30"], answer: "27", level: "medium", time: 60 },
    // Hard
    { question: "What is 144 / 12?", options: ["12", "11", "10", "9"], answer: "12", level: "hard", time: 90 },
    { question: "What is 25 * 4?", options: ["100", "105", "110", "120"], answer: "100", level: "hard", time: 90 },
    // Very Hard
    { question: "What is the square root of 289?", options: ["17", "18", "19", "20"], answer: "17", level: "very hard", time: 120 },
    { question: "What is 5 to the power of 3?", options: ["125", "130", "135", "140"], answer: "125", level: "very hard", time: 120 },
    // Legendary
    { question: "What is the factorial of 5?", options: ["120", "130", "140", "150"], answer: "120", level: "legendary", time: 180 }
];

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(questions[0].time);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState({ visible: false, message: "", coins: 0 });
    const navigate = useNavigate()

    useEffect(() => {
        if (feedback.visible) return; // Stop the timer if feedback is visible

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000); // 1-second intervals

        if (timeLeft === 0 && !feedback.visible) {
            handleFeedback(false, "Time's up!");
        }

        return () => clearInterval(timer);
    }, [timeLeft, feedback.visible]);

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimeLeft(questions[nextQuestion].time);
            setFeedback({ visible: false, message: "", coins: 0 });
        } else {
            alert(`Quiz Complete! Your score: ${score}/${questions.length}`);
        }
    };

    const handleOptionClick = (option) => {
        if (option === questions[currentQuestion].answer) {
            const earnedCoins = 10; // Example coin reward
            setScore(score + 1);
            handleFeedback(true, "Correct! You've earned coins.", earnedCoins);
        } else {
            handleFeedback(false, "Incorrect!");
        }
    };

    const handleFeedback = (isCorrect, message, coins = 0) => {
        setFeedback({ visible: true, message, coins });
    };

    const current = questions[currentQuestion];
    const gradient = getGradientForLevel(current.level);

    function getGradientForLevel(level) {
        switch (level) {
            case "easy":
                return "linear-gradient(135deg, #F9E79F, #F7DC6F)";
            case "medium":
                return "linear-gradient(135deg, #AED6F1, #5DADE2)";
            case "hard":
                return "linear-gradient(135deg, #F5B7B1, #EC7063)";
            case "very hard":
                return "linear-gradient(135deg, #D98880, #C0392B)";
            case "legendary":
                return "linear-gradient(135deg, #D7BDE2, #A569BD)";
            default:
                return "linear-gradient(135deg, #F9E79F, #F7DC6F)";
        }
    }

    return (
        <div style={styles.quizContainer}>
            <Header />
            <div style={styles.quizContent}>
                <h2 style={{ ...styles.quizTitle, background: gradient }}>{current.level.toUpperCase()}</h2>
                <div style={{ ...styles.questionContainer, filter: feedback.visible ? 'blur(3px)' : 'none' }}>
                    <p style={styles.questionText}>{current.question}</p>
                </div>
                <div style={styles.optionsContainer}>
                    {current.options.map((option, index) => (
                        <button key={index} style={styles.optionButton} onClick={() => handleOptionClick(option)} disabled={feedback.visible}>
                            {option}
                        </button>
                    ))}
                </div>
                <div style={styles.timeBarContainer}>
                    <div style={{ ...styles.timeBar, width: `${(timeLeft / current.time) * 100}%` }}></div>
                </div>
            </div>
            <div style={styles.mascotContainer}>
            <img
          src="assets/mascot.png" // Replace with your actual image source
          alt="Main Character"
          style={styles.mascotImage}
        />
            </div>
            {feedback.visible && (
                <div style={styles.feedbackOverlay}>
                    <div style={styles.feedbackContainer}>
                        <p style={styles.feedbackText}>{feedback.message}</p>
                        {feedback.coins > 0 && (
                            <div style={styles.coinDisplay}>+{feedback.coins} $QST</div>
                        )}
                        <div style={styles.feedbackButtonContainer}>
                            <button style={styles.breakButton} onClick={() => navigate("/")}>Take a Break</button>
                            <button style={styles.nextButton} onClick={handleNextQuestion}>Next Question</button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    quizContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#000',
        height: '96vh',
        overflow: 'hidden',
    },
    quizContent: {
        width: '90%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
        padding: '20px',
        backgroundColor: '#111',
        borderRadius: '12px',
    },
    quizTitle: {
        color: 'black',
        fontSize: '24px',
        marginBottom: '20px',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '50%', // Title width is set to half of the container's width
        alignSelf: 'center', // Centering the title
    },
    questionContainer: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#222',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#fff',
    },
    questionText: {
        margin: 0,
        fontSize: '18px',
    },
    optionsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Two columns layout
        gap: '10px', // Space between the buttons
        width: '100%',
        marginBottom: '20px', // Space between options and timer
    },
    optionButton: {
        padding: '12px 16px',
        fontSize: '16px',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)', // Black and gray gradient
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Shadow similar to the bottom tab
    },
    timeBarContainer: {
        width: '100%',
        height: '10px',
        backgroundColor: '#333',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    timeBar: {
        height: '100%',
        background: 'linear-gradient(135deg, #ff00ff, #8000ff)', // Gradient color for the time bar
        transition: 'width 0.1s linear', // Smooth transition
    },
    feedbackOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
        zIndex: 10,
    },
    feedbackContainer: {
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#fff',
    },
    feedbackText: {
        fontSize: '20px',
        marginBottom: '15px',
    },
    coinDisplay: {
        margin: '10px 0',
        padding: '12px 16px',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)', // Matching the option style gradient
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Matching the option style shadow
    },
    feedbackButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    nextButton: {
        padding: '5px 24px',
        fontSize: '15px',
        color: 'white',
        background: 'linear-gradient(135deg, #8a2be2, #c71585)', // Matching the start journey button gradient
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        margin: '5px',
        width: '48%', // Ensures buttons are same size
    },
    breakButton: {
        padding: '5px 24px',
        fontSize: '15px',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)', // Matching the option style gradient
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '5px',
        width: '48%', // Ensures buttons are same size
    },
    mascotImage: {
        maxWidth: '40%',
        height: 'auto',
        borderRadius: '12px',
      },
      mascotContainer: {
        display :"flex",
        justifyContent : "center",
        alignItems : "center"
      }
};

export default QuizPage;
