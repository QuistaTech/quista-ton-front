import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomTabNavigator = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div style={styles.navContainer}>
            <Link to="/marketplace" style={styles.navItem}>
                <img
                    src="/assets/marketplace.svg"
                    alt="Marketplace"
                    style={{
                        ...styles.icon,
                        filter: isActive('/marketplace') ? 'invert(21%) sepia(86%) saturate(5864%) hue-rotate(287deg) brightness(99%) contrast(102%)' : 'invert(75%) sepia(6%) saturate(0%) hue-rotate(216deg) brightness(89%) contrast(89%)',

                      
                        borderRadius: '50%',
                    }}
                />
            </Link>
            <Link to="/" style={styles.navItem}>
                <img
                    src="/assets/home.svg"
                    alt="Home"
                    style={{
                        ...styles.icon,
                        filter: isActive('/') ? 'invert(21%) sepia(86%) saturate(5864%) hue-rotate(287deg) brightness(99%) contrast(102%)' : 'invert(75%) sepia(6%) saturate(0%) hue-rotate(216deg) brightness(89%) contrast(89%)',
                   
                        borderRadius: '50%',
                    }}
                />
            </Link>

            <Link to="/profile" style={styles.navItem}>
                <img
                    src="/assets/profile.svg"
                    alt="Profile"
                    style={{
                        ...styles.icon,
                        filter: isActive('/profile') ? 'invert(21%) sepia(86%) saturate(5864%) hue-rotate(287deg) brightness(99%) contrast(102%)' : 'invert(75%) sepia(6%) saturate(0%) hue-rotate(216deg) brightness(89%) contrast(89%)',
                    
                        borderRadius: '50%',
                    }}
                />
            </Link>
        </div>
    );
};

const styles = {
    navContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%', // Adjust to fit within screen width as an island shape
        maxWidth: '400px',
        padding: '15px 15px',
        borderRadius: '2vh', // Creates rounded island shape
        background: 'linear-gradient(135deg, #333, #111)', // Background gradient for the island
        position: 'fixed',
        bottom: '20px', // Lifted up slightly to create an island effect
        left: '50%',
        transform: 'translateX(-50%)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Shadow for the island effect
        zIndex : "9999"
    },
    navItem: {
        textDecoration: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '40px',
        height: '25px',
        transition: 'filter 0.3s ease, background 0.3s ease, padding 0.3s ease',
    },
};

export default BottomTabNavigator;
