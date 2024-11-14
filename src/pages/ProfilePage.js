import { useTonAddress } from '@tonconnect/ui-react';
import React, { useState } from 'react';

const ProfilePage = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default language state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const walletAddress = useTonAddress();
    const userInfos = {
        nickname: "Adventurer",
        walletAddress: walletAddress,
        balance: "0.00"
    };

    // Function to format wallet address
    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 4)}...${address.slice(-3)}`;
    };

    // Function to handle copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(userInfos.walletAddress);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 3000); // Revert to copy icon after 3 seconds
    };

    const handleClaim = () => {
        // Placeholder for claim functionality
        console.log("Claim button clicked");
    };

    // Handle language change
    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <div style={styles.container}>
            {!walletAddress && (
                <div style={styles.overlay}>
                    <p style={styles.overlayText}>Please connect a wallet</p>
                </div>
            )}
            <div style={walletAddress ? styles.profileContainer : { ...styles.profileContainer, filter: 'blur(5px)', pointerEvents: 'none' }}>
                {/* Avatar and Nickname */}
                <div style={styles.avatarContainer}>
                    <img src="assets/mascot.png" alt="Avatar" style={styles.avatar} />
                    <h2 style={styles.nickname}>{userInfos.nickname}</h2>
                </div>

                {/* Wallet and Balance Section */}
                <div style={styles.sectionContainer}>
                    <div style={styles.section}>
                        <h3 style={styles.sectionHeader}>Wallet</h3>
                        <div style={styles.row}>
                            <div style={styles.walletInfoContainer}>
                                <img src="assets/wallet.svg" alt="Wallet Icon" style={styles.rowIcon} />
                                <p style={styles.walletText}>
                                    Wallet Address: <span style={styles.gradientText}>{formatAddress(userInfos.walletAddress)}</span>
                                </p>
                            </div>
                            <button onClick={handleCopy} style={styles.copyButton}>
                                <img
                                    src={isCopied ? "assets/tick.svg" : "assets/copy.svg"}
                                    alt={isCopied ? "Copied" : "Copy"}
                                    style={styles.rowIcon}
                                />
                            </button>
                        </div>
                        <div style={styles.separator}></div>
                        <div style={styles.rowWithButton}>
                            <div style={styles.row}>
                                <img src="assets/balance.svg" alt="Balance Icon" style={styles.rowIcon} />
                                <p style={styles.balanceText}>
                                    Balance: <span style={styles.gradientText}>{userInfos.balance}</span>
                                </p>
                            </div>
                            <button style={styles.claimButton} onClick={handleClaim}>Claim</button>
                        </div>
                    </div>
                </div>

                {/* Settings and Language Section */}
                <div style={styles.sectionContainer}>
                    <div style={styles.section}>
                        <h3 style={styles.sectionHeader}>Settings & Language</h3>
                        <div style={styles.row}>
                            <img src="assets/settings.svg" alt="Settings Icon" style={styles.rowIcon} />
                            <p style={styles.settingsText}>Settings</p>
                            <img src="assets/right-arrow.svg" alt="Right Arrow Icon" style={styles.rowIcon} />
                        </div>
                        <div style={styles.separator}></div>
                        <div style={styles.row}>
                            <img src="assets/language.svg" alt="Language Icon" style={styles.rowIcon} />
                            <p style={styles.settingsText}>Language</p>
                            <div style={styles.languageDropdownContainer}>
                                <div 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                    style={styles.languageOption}
                                >
                                    <img
                                        src={`assets/${selectedLanguage.toLowerCase()}.svg`}
                                        alt={selectedLanguage}
                                        style={styles.languageIcon}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div style={styles.dropdownMenu}>
                                        <div onClick={() => handleLanguageChange("English")} style={styles.languageOption}>
                                            <img src="assets/english.svg" alt="English" style={styles.languageIcon} />
                                        </div>
                                        <div onClick={() => handleLanguageChange("Turkish")} style={styles.languageOption}>
                                            <img src="assets/turkish.svg" alt="Turkish" style={styles.languageIcon} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10,
    },
    overlayText: {
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        marginBottom : "20%"
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'black', // Black background
        minHeight: '100vh',
        color: 'white',
    },
    avatarContainer: {
        marginTop: "10%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: '4px solid #8a2be2', // Purple border accent
        marginBottom: '10px',
    },
    nickname: {
        margin: 0,
        fontSize: '24px',
        color: '#c71585',
        textAlign: 'center',
    },
    sectionContainer: {
        width: '90%',
        margin: '10px 0',
    },
    section: {
        background: 'linear-gradient(135deg, #333, #111)', // Matching the gradient style
        padding: '15px',
        borderRadius: '2vh',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    },
    sectionHeader: {
        margin: '0 0 10px 0',
        fontSize: '18px',
        color: '#fff',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
    },
    walletInfoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    rowWithButton: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowIcon: {
        width: '24px',
        height: '24px',
        marginRight: '10px',
        filter: 'invert(75%) sepia(6%) saturate(100%) hue-rotate(260deg) brightness(100%) contrast(100%)', // Match the icon filter style
    },
    separator: {
        height: '1px',
        backgroundColor: '#555',
        margin: '10px 0',
        width: '100%',
    },
    walletText: {
        fontSize: '16px',
        color: '#dcdcdc',
        overflowWrap: 'break-word',
    },
    balanceText: {
        fontSize: '16px',
        color: '#dcdcdc',
        marginRight: '10px',
    },
    gradientText: {
        background: 'linear-gradient(135deg, #8a2be2, #0090EA)', // Blue to purple gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    copyButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        marginLeft: 'auto',
    },
    claimButton: {
        padding: '8px 16px',
        fontSize: '14px',
        color: 'white',
        background: 'linear-gradient(135deg, #8a2be2, #c71585)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        marginLeft: 'auto', // Align button to the right
    },
    settingsText: {
        fontSize: '16px',
        color: '#dcdcdc',
        marginRight: 'auto', // Ensures the text is left-aligned
    },
    languageDropdownContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    languageOption: {
        cursor: 'pointer',
    },
    languageIcon: {
        width: '30px',
        height: '30px',
        borderRadius: '4px',
        marginRight: "10px"
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: '#333',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 1,
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
};

export default ProfilePage;
