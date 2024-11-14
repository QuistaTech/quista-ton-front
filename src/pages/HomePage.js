import React from 'react';
import Header from '../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTonWallet } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const HomePage = () => {
  const wallet = useTonWallet();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleStartJourney = () => {
    if (!wallet) {
      toast.error("You have to connect a wallet to start the daily journey", {
        style: {
          backgroundColor: '#1b1b1b', // Black background
          color: 'white', // White text
        },
        progressStyle: {
          background: '#0090EA', // Purple progress bar
        },
      });
    } else {
      // Navigate to the quiz page if the wallet exists
      navigate('/quiz');
    }
  };

  return (
    <div style={styles.homeContainer}>
      <Header />
      <div style={styles.mascotContainer}>
        <img
          src="assets/mascot.png" // Replace with your actual image source
          alt="Main Character"
          style={styles.mascotImage}
        />
      </div>
      <div style={styles.centerButtonContainerWithSides}>
        <div style={styles.sideSection}>
          <button style={styles.sideButton}>
            <img src="assets/right.svg" alt="Icon 1" style={styles.icon} />
            <span style={styles.sideNumber}>{wallet ? "13/13" : "-"}</span>
          </button>
        </div>
        <div style={styles.sideSection}>
          <button style={styles.sideButton}>
            <img src="assets/eraser.svg" alt="Icon 2" style={styles.icon} />
            <span style={styles.sideNumber}>{wallet ? "3/3" : "-"}</span>
          </button>
        </div>
      </div>
      <div style={styles.mainCenterButton}>
        <button style={styles.startQuizButton} onClick={handleStartJourney}>Start Daily Journey</button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

const styles = {
  homeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#000',
    height: '100vh',
    overflow: 'hidden',
  },
  mascotContainer: {
    marginTop: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    maxWidth: '80%',
    height: 'auto',
    borderRadius: '12px',
  },
  centerButtonContainerWithSides: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    marginTop: '20px',
    marginBottom: '20px',
  },
  sideSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  sideButton: {
    padding: '12px',
    backgroundColor: '#000',
    border: 'none',
    borderRadius: '12px',
    boxShadow: `
      0 0 10px rgba(138, 43, 226, 0.6), 
      0 0 15px rgba(199, 21, 133, 0.5)
    `,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff',
  },
  icon: {
    width: '24px',
    height: '24px',
    filter: 'invert(75%) sepia(6%) saturate(100%) hue-rotate(260deg) brightness(100%) contrast(100%)',
  },
  sideNumber: {
    fontSize: '14px',
    color: 'white',
    margin: 0,
  },
  mainCenterButton: {
    margin: '20px 10px',
  },
  startQuizButton: {
    padding: '14px 24px',
    fontSize: '16px',
    color: 'white',
    background: 'linear-gradient(135deg, #8a2be2, #c71585)',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
};

export default HomePage;
