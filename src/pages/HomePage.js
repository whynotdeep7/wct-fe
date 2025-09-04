import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import PixelMap from '../components/PixelMap';
import WishSubmissionModal from '../components/WishSubmissionModal';
import WishViewModal from '../components/WishViewModal';
import LoginModal from '../components/LoginModal';
import ConnectWalletModal from '../components/ConnectWalletModal';

const HomePage = () => {
  const { user, logout, walletAddress, walletConnected, walletType, disconnectWallet } = useAuth();
  const [selectedPixel, setSelectedPixel] = useState(null);
  const [modalType, setModalType] = useState(null); // 'wish', 'view', 'login'
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePixelClick = (pixel) => {
    setSelectedPixel(pixel);
    
    if (pixel.hasWish) {
      // Pixel has a wish - show it
      setModalType('view');
    } else {
      // Pixel is available - check if user is logged in
      if (user) {
        setModalType('wish');
      } else {
        setShowLoginModal(true);
      }
    }
  };

  const handleWishSubmitted = (updatedPixel) => {
    setSelectedPixel(updatedPixel);
    setModalType('view');
    setRefreshTrigger(prev => prev + 1); // Trigger pixel map refresh
  };

  const closeModal = () => {
    setSelectedPixel(null);
    setModalType(null);
    setShowLoginModal(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    if (selectedPixel && !selectedPixel.hasWish) {
      setModalType('wish');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-page">
      <motion.header 
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <motion.div 
            className="logo-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1>WcT</h1>
            <p>Share your dreams, help others' wishes come true</p>
          </motion.div>

          <motion.div 
            className="user-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
              <div className="user-info">
                <div className="user-details">
                  <span className="user-email">{user.email}</span>
                  {walletConnected ? (
                    <div className="wallet-info">
                      <span className="wallet-address">
                        {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                      </span>
                      {walletType && (
                        <span className="wallet-address" style={{ opacity: 0.8 }}>
                          {walletType.includes('solana') ? 'Solana' : 'EVM'}
                        </span>
                      )}
                      <motion.button 
                        className="disconnect-wallet-btn"
                        onClick={disconnectWallet}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Disconnect
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button 
                      className="connect-wallet-btn"
                      onClick={() => setShowWalletModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Connect Wallet
                    </motion.button>
                  )}
                </div>
                <motion.button 
                  className="logout-btn"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button 
                className="login-btn"
                onClick={() => setShowLoginModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login to Submit Wishes
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.header>

      <main className="app-main">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <PixelMap 
            onPixelClick={handlePixelClick}
            selectedPixelId={selectedPixel?.pixelId}
            refreshTrigger={refreshTrigger}
          />
        </motion.div>
      </main>

      {/* Modals */}
      {selectedPixel && modalType === 'wish' && (
        <WishSubmissionModal
          pixel={selectedPixel}
          onClose={closeModal}
          onWishSubmitted={handleWishSubmitted}
        />
      )}

      {selectedPixel && modalType === 'view' && (
        <WishViewModal
          pixel={selectedPixel}
          onClose={closeModal}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showWalletModal && (
        <ConnectWalletModal
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </div>
  );
};

export default HomePage;