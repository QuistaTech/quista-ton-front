import React, { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { registerUser } from '../services/userService';
import { claimTokens } from '../services/web3Service';
import {styles} from '../styles/ProfilePage';

const ProfilePage = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const walletAddress = useTonAddress();
    const [userInfos, setUserInfos] = useState({
        nickname: "Adventurer",
        walletAddress: walletAddress,
        balance: "0.00",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility
    const [modalMessage, setModalMessage] = useState(""); // Modal message

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (walletAddress) {
                const userData = await registerUser(walletAddress);
                if (userData.success) {
                    setUserInfos({
                        nickname: userData.user.nickname || "Adventurer",
                        walletAddress: userData.user.wallet_address,
                        balance: userData.user.balance || "0.00",
                    });
                } else {
                    console.error('Error registering or retrieving user:', userData.message);
                }
            }
        };

        fetchUserInfo();
    }, [walletAddress]);

    const handleClaim = async () => {
        if (!walletAddress) return;

        setIsLoading(true);
        try {
            const response = await claimTokens(walletAddress);
            console.log("Claim Response", response);

            if (response.success) {
                // Re-fetch user info after successful claim
                const userData = await registerUser(walletAddress);
                if (userData.success) {
                    setUserInfos({
                        nickname: userData.user.nickname || "Adventurer",
                        walletAddress: userData.user.wallet_address,
                        balance: userData.user.balance || "0.00",
                    });
                }
            } else {
                // Show modal if the claim fails
                setModalMessage(response.message || "Balance is not enough to claim tokens.");
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error during claim:", error);
            setModalMessage("An error occurred while processing your request.");
            setModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 4)}...${address.slice(-3)}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(userInfos.walletAddress);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false);
    };

    return (
        <div style={styles.container}>
            {!walletAddress && (
                <div style={styles.overlay}>
                    <p style={styles.overlayText}>Please connect a wallet</p>
                </div>
            )}
            <div style={walletAddress ? styles.profileContainer : { ...styles.profileContainer, filter: 'blur(5px)', pointerEvents: 'none' }}>
                <div style={styles.avatarContainer}>
                    <img src="assets/mascot.png" alt="Avatar" style={styles.avatar} />
                    <h2 style={styles.nickname}>{userInfos.nickname}</h2>
                </div>

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
                                    Balance: <span style={styles.gradientText}>{userInfos.balance} $QST</span>
                                </p>
                            </div>
                            <button
                                style={{
                                    ...styles.claimButton,
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onClick={handleClaim}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div style={styles.spinner}></div>
                                ) : (
                                    "Claim"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <p>{modalMessage}</p>
                        <button style={styles.closeButton} onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ProfilePage;
