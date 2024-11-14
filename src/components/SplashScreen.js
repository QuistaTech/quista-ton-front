// components/SplashScreen.js
import React from 'react';

const SplashScreen = () => {
  return (
    <div style={styles.container}>
      <img src="assets/main-logo.png" alt="Loading..." style={styles.logo} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
  },
  logo: {
    width: '250px',
    height: '250px',

  },
};

export default SplashScreen;
