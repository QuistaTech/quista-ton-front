export const styles = {
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
        padding: '8px 24px',
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
    spinner: {
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#c71585',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};