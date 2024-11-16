import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { feedQuestion, answerQuestion } from '../services/questionService';

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [feedback, setFeedback] = useState({ visible: false, isCorrect: false, tokens: 0 });
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null);
    const [journeyFinished, setJourneyFinished] = useState(false); // State for journey completion
    const navigate = useNavigate();

    // Get wallet address from local storage
    const walletAddress = localStorage.getItem('walletAddress');

    // Fetch the first question when the component mounts and walletAddress is available
    useEffect(() => {
        if (walletAddress) {
            fetchQuestion();
        } else {
            setError('Wallet address not found. Please connect your wallet.');
        }
    }, []);

    const fetchQuestion = async () => {
        if (!walletAddress) {
            setError('Wallet address not available.');
            return;
        }
        setLoading(true); // Show loading indicator

        try {
            const response = await feedQuestion(walletAddress);
            if (response.success) {
                const difficultyLevel = mapDifficultyToLevel(response.question.difficulty);
                setCurrentQuestion({ ...response.question, level: difficultyLevel });
                setTimeLeft(getTimeForDifficulty(difficultyLevel));
                setError(null);
            } else {
                setError(response.message || 'An unexpected error occurred.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false); // Hide loading indicator after fetching
        }
    };

    useEffect(() => {
        if (feedback.visible || !currentQuestion) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        if (timeLeft === 0 && !feedback.visible && currentQuestion) {
            setFeedback({ visible: true, isCorrect: false, tokens: 0 });
        }

        return () => clearInterval(timer);
    }, [timeLeft, feedback.visible, currentQuestion]);

    const handleNextQuestion = () => {
        setFeedback({ visible: false, isCorrect: false, tokens: 0 });
        setCurrentQuestion(null); // Clear current question before fetching the next
        fetchQuestion(); // Fetch a new question
    };

    const handleFinishJourney = () => {
        setJourneyFinished(true); // Set journey finished state
    };

    const handleOptionClick = async (option) => {
        if (!currentQuestion) return;

        try {
            const response = await answerQuestion(walletAddress, currentQuestion.question_id, option);
            setFeedback({
                visible: true,
                isCorrect: response.success && response.isCorrectAnswer,
                tokens: response.tokensAdded || 0,
            });
        } catch (err) {
            setFeedback({ visible: true, isCorrect: false, tokens: 0 });
        }
    };

    const mapDifficultyToLevel = (difficulty) => {
        switch (difficulty) {
            case 1: return "easy";
            case 2: return "medium";
            case 3: return "hard";
            case 4: return "very hard";
            case 5: return "legendary";
            default: return "unknown";
        }
    };

    const getTimeForDifficulty = (level) => {
        switch (level) {
            case "easy": return 30;
            case "medium": return 45;
            case "hard": return 60;
            case "very hard": return 90;
            case "legendary": return 120;
            default: return 30;
        }
    };

    const gradient = currentQuestion ? getGradientForLevel(currentQuestion.level) : "linear-gradient(135deg, #F9E79F, #F7DC6F)";

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
            {error ? (
                <div style={styles.journeyContainer}>
                    <p style={styles.errorMessage}>{error}</p>
                    <button style={styles.homeButton} onClick={() => navigate('/')}>Home</button>
                </div>
            ) : loading ? (
                <div style={styles.loadingContainer}>
                    <p style={styles.loadingText}>New question coming...</p>
                    <div style={styles.spinner}></div>
                </div>
            ) : currentQuestion ? (
                journeyFinished ? (
                    <div style={styles.journeyContainer}>
                        <p style={styles.journeyText}>Congratulations! You've finished the journey.</p>
                        <button style={styles.nextButton} onClick={() => navigate("/")}>Go Home</button>
                    </div>
                ) : (
                    <div style={styles.quizContent}>
                        <h2 style={{ ...styles.quizTitle, background: gradient }}>{currentQuestion.level.toUpperCase()}</h2>
                        <div style={{ ...styles.questionContainer, filter: feedback.visible ? 'blur(3px)' : 'none' }}>
                            <p style={styles.questionText}>{currentQuestion.question_text}</p>
                        </div>
                        <div style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => (
                                <button key={index} style={styles.optionButton} onClick={() => handleOptionClick(option)} disabled={feedback.visible}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div style={styles.timeBarContainer}>
                            <div style={{ ...styles.timeBar, width: `${(timeLeft / getTimeForDifficulty(currentQuestion.level)) * 100}%` }}></div>
                        </div>
                        {feedback.visible && (
                            <div style={styles.feedbackOverlay}>
                                <div style={styles.feedbackContainer}>
                                    <div style={styles.feedbackCombinedContainer}>
                                        <div style={styles.feedbackTextWithIcon}>
                                            <span style={styles.feedbackText}>
                                                {feedback.isCorrect ? "Correct" : "Incorrect"}
                                            </span>
                                        </div>
                                        {feedback.tokens > 0 && (
                                            <span style={styles.tokenDisplay}>+{feedback.tokens} $QST</span>
                                        )}
                                    </div>
                                    <div style={styles.feedbackButtonContainer}>
                                        {currentQuestion.level === "legendary" ? (
                                            <button style={styles.finishButton} onClick={handleFinishJourney}>Finish the Journey</button>
                                        ) : (
                                            <>
                                                <button style={styles.breakButton} onClick={() => navigate("/")}>Take a Break</button>
                                                <button style={styles.nextButton} onClick={handleNextQuestion}>Next Question</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            ) : (
                <p style={styles.loadingMessage}>Loading question...</p>
            )}
            <div style={styles.mascotContainer}>
                <img
                    src="assets/mascot.png"
                    alt="Main Character"
                    style={styles.mascotImage}
                />
            </div>
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
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20%',
        color: 'white',
    },
    errorMessage: {
        fontSize: '20px',
        marginBottom: '20px',
    },
    homeButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        background: 'linear-gradient(135deg, #8a2be2, #c71585)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
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
        width: '50%',
        alignSelf: 'center',
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
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        width: '100%',
        marginBottom: '20px',
    },
    optionButton: {
        padding: '12px 16px',
        fontSize: '16px',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
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
        background: 'linear-gradient(135deg, #ff00ff, #8000ff)',
        transition: 'width 0.1s linear',
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10,
    },
    feedbackContainer: {
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#fff',
    },
    feedbackCombinedContainer: {
        padding: '20px 40px',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    feedbackTextWithIcon: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    feedbackText: {
        fontSize: '30px',
        color: '#fff',
      
    },
    tokenDisplay: {
        fontSize: '25px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #8a2be2, #0090EA)', // Blue to purple gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginTop: '10px', // Add margin if needed
        textAlign: 'center',
    },
    feedbackIcon: {
        width: '34px',
        height: '34px',
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
        background: 'linear-gradient(135deg, #8a2be2, #c71585)',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        margin: '5px',
        width: '48%',
    },
    finishButton:{
        padding: '5px 24px',
        fontSize: '15px',
        color: 'white',
        background: 'linear-gradient(135deg, #8a2be2, #c71585)',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        margin: '5px',
        width: '100%',
    },
    breakButton: {
        padding: '5px 24px',
        fontSize: '15px',
        color: '#fff',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        margin: '5px',
        width: '48%',
    },
    mascotImage: {
        maxWidth: '40%',
        height: 'auto',
        borderRadius: '12px',
    },
    mascotContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    loadingMessage: {
        color: 'white',
        marginTop: '20%',
        fontSize: '18px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        color: 'white',
    },
    loadingText: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    journeyContainer: {
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#fff',
        marginTop: '30%',
        maxWidth: '100%',
        background: 'linear-gradient(135deg, #2c2c2c, #4d4d4d)', // Same background style as Take a Break button
        marginBottom : '20%',
    },
    journeyText: {
        fontSize: '24px',
        marginBottom: '20px',
        color: "#fff"
    },
};

export default QuizPage;
