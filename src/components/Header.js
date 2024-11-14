import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import React from 'react';

const Header = () => {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  return (
    <div style={styles.headerContainer}>
      <img src="assets/main-logo.png" alt="Quista Logo" style={styles.logo} />
      {/* <button style={styles.connectButton} onClick={() => {
        tonConnectUI.openModal()
      }
      }>Connect Wallet</button> */}
      <TonConnectButton>Connect Wallet</TonConnectButton>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    borderBottomLeftRadius: '12px', // Bottom-only radius
    borderBottomRightRadius: '12px', // Bottom-only radius
    background: 'transparent', // No background color
    width : "85%",
    boxShadow: `
      0 10px 10px -5px rgba(138, 43, 226, 0.6),  /* First shadow layer (purple) */
      0 15px 15px -5px rgba(199, 21, 133, 0.5) /* Second shadow layer (magenta) */
    `,
    zIndex : "99999"
  },
  logo: {
    width: '25%', // Adjust logo size as needed
    height: 'auto',
  },
  connectButton: {
    padding: '8px 16px',
    fontSize: '14px',
    color: 'white',
    background: 'linear-gradient(135deg, #8a2be2, #c71585)', // Same gradient as active tab button
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Elevated shadow effect
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    whiteSpace: 'nowrap', // Prevents text from wrapping to a new line
  },
  connectButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.35)', // Slightly deeper shadow on hover
  },
};

export default Header;

