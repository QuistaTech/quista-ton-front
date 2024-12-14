import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';

const HomePage = () => {
  const wallet = useTonWallet();
  const walletAddress = useTonAddress();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ xp: 0, daily_right: '-', eraser: '-' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (wallet) {
        try {
          setLoading(true);
          const response = await registerUser(walletAddress);
          if (response.success) {
            setUserInfo({
              daily_right: response.user.daily_right,
              eraser: response.user.eraser,
              xp: response.user.xp,
            });
          } else {
            console.error(response.message);
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [wallet]);

  const calculateEdges = (xp) => {
    const maxEarnXp = 600;
    const magicNumber = 2.69;
    const constant = 70;
    const level = calculateLevel(xp);
    const lowerEdge = (maxEarnXp / constant) * (Math.pow(level,magicNumber));
    const higherEdge = (maxEarnXp / constant) * (Math.pow(level+1,magicNumber));
    return [Math.floor(lowerEdge), Math.floor(higherEdge)];
  };

  const calculateXpPercentage = (xp, lowerEdge, higherEdge) => {
    if (xp < lowerEdge) return 0;
    if (xp >= higherEdge) return 100;
    return ((xp - lowerEdge) / (higherEdge - lowerEdge)) * 100;
  };

  const calculateLevel = (xp) => {
    const maxEarnXp = 600;
    const magicNumber = 2.69;
    const constant = 70;
    return Math.floor(Math.pow((constant * xp) / maxEarnXp, 1 / magicNumber));
  };

  const handleStartJourney = () => {
    if (!wallet) {
      toast.error('You have to connect a wallet to start the daily journey', {
        style: { backgroundColor: '#1b1b1b', color: 'white' },
        progressStyle: { background: '#0090EA' },
      });
    } else {
      navigate('/quiz');
    }
  };

  const LoadingIndicator = () => (
      <div style={styles.loadingIndicator}></div>
  );

  const [lowerEdge, higherEdge] = calculateEdges(userInfo.xp);
  const xpPercentage = calculateXpPercentage(userInfo.xp, lowerEdge, higherEdge);

  return (
      <div style={styles.homeContainer}>
        <Header />
        <div style={styles.xpBarWrapper}>
          <div style={styles.levelText}>
            Level {calculateLevel(userInfo.xp)}
          </div>
          <div style={styles.xpBarContainer}>
            <div
                style={{
                  ...styles.xpBar,
                  width: `${xpPercentage}%`,
                }}
            ></div>
          </div>
          <div style={styles.xpText}>
            {userInfo.xp}/{higherEdge} XP
          </div>
        </div>
        <div style={styles.mascotContainer}>
          <img
              src="assets/mascot.png"
              alt="Main Character"
              style={styles.mascotImage}
          />
        </div>
        <div style={styles.centerButtonContainerWithSides}>
          <div style={styles.sideSection}>
            <button style={styles.sideButton}>
              <img src="assets/right.svg" alt="Daily Right Icon" style={styles.icon} />
              {loading ? <LoadingIndicator /> : <span style={styles.sideNumber}>{userInfo.daily_right}/13</span>}
            </button>
          </div>
          <div style={styles.sideSection}>
            <button style={styles.sideButton}>
              <img src="assets/eraser.svg" alt="Eraser Icon" style={styles.icon} />
              {loading ? <LoadingIndicator /> : <span style={styles.sideNumber}>{userInfo.eraser}/3</span>}
            </button>
          </div>
        </div>
        <div style={styles.mainCenterButton}>
          <button style={styles.startQuizButton} onClick={handleStartJourney}>
            Start Daily Journey
          </button>
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
    boxShadow: `0 0 10px rgba(138, 43, 226, 0.6), 0 0 15px rgba(199, 21, 133, 0.5)`,
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
  loadingIndicator: {
    width: '20px',
    height: '20px',
    border: '3px solid white',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 5s linear infinite',
  },
  xpBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: '20px 0',
  },
  xpBarContainer: {
    width: '100%',
    height: '16px',
    backgroundColor: '#333',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
  xpBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #8B1E86,#0090EA)',
    transition: 'width 0.5s ease',
  },
  xpText: {
    marginTop: '8px',
    color: '#fff',
    fontSize: '14px',
  },
  levelText: {
    marginBottom: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default HomePage;
