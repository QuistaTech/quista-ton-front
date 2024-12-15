import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { feedQuestion, answerQuestion } from '../services/questionService';
import { registerUser } from '../services/userService'; // Fetch user info for eraser count
import { styles } from '../styles/QuizPage';

const QuizPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [feedback, setFeedback] = useState({ visible: false, isCorrect: false, tokens: 0, message: '', selectedOption: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [journeyFinished, setJourneyFinished] = useState(false);
    const [eraserCount, setEraserCount] = useState(0); // Initialize eraser count from backend
    const navigate = useNavigate();

    // Get wallet address from local storage
    const walletAddress = localStorage.getItem('walletAddress');

    const fetchQuestion = async () => {
        if (!walletAddress) {
            setError('Wallet address not available.');
            return;
        }
        setLoading(true);

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
            setLoading(false);
        }
    };

    // Fetch user info and initial question when component mounts
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (walletAddress) {
                try {
                    const response = await registerUser(walletAddress);
                    if (response.success) {
                        setEraserCount(response.user.eraser); // Set eraser count from backend
                    } else {
                        console.error('Error fetching user info:', response.message);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            } else {
                setError('Wallet address not found. Please connect your wallet.');
            }
        };

        fetchUserInfo();
        fetchQuestion();
    }, [walletAddress]);

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
        setFeedback({ visible: false, isCorrect: false, tokens: 0, message: '', selectedOption: null });
        setCurrentQuestion(null);
        fetchQuestion();
    };

    const handleFinishJourney = () => {
        setJourneyFinished(true);
    };

    const handleOptionClick = async (option) => {
        if (!currentQuestion) return;

        try {
            const response = await answerQuestion(walletAddress, currentQuestion.question_id, option);

            if (response.success && response.isCorrectAnswer) {
                setFeedback({
                    visible: true,
                    isCorrect: true,
                    tokens: response.tokensAdded || 0,
                    message: 'Correct!',
                    selectedOption: option
                });
            } else {
                setFeedback({
                    visible: true,
                    isCorrect: false,
                    tokens: 0,
                    message: 'Incorrect answer. Please choose an option:',
                    showOptionsPrompt: true,
                    selectedOption: option
                });
            }
        } catch (err) {
            setFeedback({ visible: true, isCorrect: false, tokens: 0, message: 'An error occurred.', selectedOption: option });
        }
    };

    const useEraser = () => {
        if (!currentQuestion) return;

        setEraserCount(prev => prev - 1);

        const updatedOptions = currentQuestion.options.filter(opt => opt !== feedback.selectedOption);
        setCurrentQuestion({ ...currentQuestion, options: updatedOptions });

        setFeedback({ visible: false, isCorrect: false, tokens: 0, message: '', showOptionsPrompt: false, selectedOption: null });
    };

    const goToNextQuestion = () => {
        handleNextQuestion();
    };

    const endExam = () => {
        navigate('/'); // Redirect to home or end page
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
                        <p>Erasers remaining: {eraserCount}</p>
                        <div style={{ ...styles.questionContainer, filter: feedback.visible && !feedback.showOptionsPrompt ? 'blur(3px)' : 'none' }}>
                            <p style={styles.questionText}>{currentQuestion.question_text}</p>
                        </div>
                        <div style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => (
                                <button key={index} style={styles.optionButton} onClick={() => handleOptionClick(option)} disabled={feedback.visible && !feedback.showOptionsPrompt}>
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
                                    {feedback.showOptionsPrompt ? (
                                        <div style={styles.feedbackButtonContainer}>
                                            {eraserCount > 0 && (
                                                <button style={styles.useEraserButton} onClick={useEraser}>Use Eraser</button>
                                            )}
                                            <button style={styles.nextButton} onClick={goToNextQuestion}>Go to Next Question</button>
                                            <button style={styles.endExamButton} onClick={endExam}>End Journey</button>
                                        </div>
                                    ) : (
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
                                    )}
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

export default QuizPage;


