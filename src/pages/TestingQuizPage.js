import React, { useState } from 'react';
import Header from '../components/Header';
import { styles } from '../styles/QuizPage';
import 'react-image-lightbox/style.css'; // Import lightbox styles
import Lightbox from 'react-image-lightbox';

const TestingQuizPage = () => {
    const [feedback, setFeedback] = useState({
        visible: false,
        isCorrect: false,
        message: '',
        selectedOption: null,
    });

    const [isImageOpen, setIsImageOpen] = useState(false); // For lightbox functionality

    const currentQuestion = {
        level: 'medium',
        question_image: 'assets/004_BBB.png', // Replace with your question image path
        options: ['Option A', 'Option B', 'Option C', 'Option D'], // Replace with your options
    };

    const handleOptionClick = (option) => {
        const isCorrectAnswer = option === 'Option B'; // Replace with correct answer logic
        setFeedback({
            visible: true,
            isCorrect: isCorrectAnswer,
            message: isCorrectAnswer ? 'Correct!' : 'Incorrect!',
            selectedOption: option,
        });
    };

    return (
        <div style={styles.quizContainer}>
            <Header />
            <div style={styles.quizContent}>
                <h2 style={{ ...styles.quizTitle, background: 'linear-gradient(135deg, #AED6F1, #5DADE2)' }}>
                    {currentQuestion.level.toUpperCase()}
                </h2>
                <div
                    style={{
                        ...styles.questionContainer,
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '8px',
                        height: '300px', // Fixed height for the container
                        overflowY: 'scroll', // Always show vertical scrollbar
                        cursor: 'pointer', // Indicate the image is clickable
                    }}
                    onClick={() => setIsImageOpen(true)} // Open lightbox on click
                >
                    <img
                        src={currentQuestion.question_image}
                        alt="Question"
                        style={{
                            maxWidth: '100%', // Ensure the image fits within the container width
                            borderRadius: '8px',
                        }}
                    />
                </div>
                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            style={styles.optionButton}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {feedback.visible && (
                    <div style={styles.feedbackOverlay}>
                        <div style={styles.feedbackContainer}>
                            <p>{feedback.message}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox for full-screen image viewing */}
            {isImageOpen && (
                <Lightbox
                    mainSrc={currentQuestion.question_image}
                    onCloseRequest={() => setIsImageOpen(false)} // Close lightbox
                    enableZoom={true} // Enable zoom functionality
                    wrapperClassName="lightbox-wrapper" // Custom class for styling
                />
            )}
        </div>
    );
};

export default TestingQuizPage;
