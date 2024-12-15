// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import BottomTabNavigator from './components/BottomTabNavigator';
import { TonConnectUIProvider, useTonWallet } from '@tonconnect/ui-react';
import QuizPage from './pages/QuizPage';
import SplashScreen from './components/SplashScreen'; // Import the splash screen
import TestingQuizPage from './pages/TestingQuizPage';


const AppContent = () => {
  const location = useLocation();
  const wallet = useTonWallet()
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-test" element={<TestingQuizPage />} />

      </Routes>
      {location.pathname !== '/quiz' && <BottomTabNavigator />}
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., 2 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TonConnectUIProvider 
      manifestUrl='https://blush-gentle-bass-964.mypinata.cloud/ipfs/QmQFcb6AvVJifEiVzJbqiJFkX3pTB22shYAmtD6prNcTwR'
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/quista_bot/Quista'
      }}
    >
      <Router>
        {isLoading ? <SplashScreen /> : <AppContent />}
      </Router>
    </TonConnectUIProvider>
  );
};

export default App;
