import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ConnectWalletModal = ({ onClose }) => {
  const { connectPhantom, connectBackpack, connectMetaMask } = useAuth();

  const phantomAvailable = !!(window?.solana?.isPhantom);
  const backpackAvailable = !!(window?.backpack?.solana);
  const metamaskAvailable = !!window?.ethereum;

  const handleConnect = async (fn) => {
    const res = await fn();
    if (res?.success) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content wallet-modal"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Connect Wallet</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p className="wallet-modal-subtitle">You need to connect a Solana wallet.</p>

            <div className="wallet-section">
              <div className="wallet-section-title">Recommended Wallets</div>
              <div className="wallet-grid">
                <motion.button
                  className={`wallet-card recommended`}
                  onClick={() => handleConnect(connectPhantom)}
                  disabled={!phantomAvailable}
                  whileHover={{ scale: phantomAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: phantomAvailable ? 0.98 : 1 }}
                >
                  <img
                    className="wallet-img"
                    alt="Phantom"
                    src="/phantom.png"
                  />
                  <div className="wallet-name">Phantom</div>
                  {!phantomAvailable && <div className="wallet-note">Install first</div>}
                </motion.button>
              </div>
            </div>

            <div className="wallet-section">
              <div className="wallet-section-title">Installed wallets</div>
              <div className="wallet-grid">
                <motion.button
                  className="wallet-card"
                  onClick={() => handleConnect(connectBackpack)}
                  disabled={!backpackAvailable}
                  whileHover={{ scale: backpackAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: backpackAvailable ? 0.98 : 1 }}
                >
                  <img
                    className="wallet-img"
                    alt="Backpack"
                    src="/backpack.png"
                  />
                  <div className="wallet-name">Backpack</div>
                  {!backpackAvailable && <div className="wallet-note">Install first</div>}
                </motion.button>

                <motion.button
                  className="wallet-card"
                  onClick={() => handleConnect(connectMetaMask)}
                  disabled={!metamaskAvailable}
                  whileHover={{ scale: metamaskAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: metamaskAvailable ? 0.98 : 1 }}
                >
                  <img
                    className="wallet-img"
                    alt="MetaMask"
                    src="/metamask.png"
                  />
                  <div className="wallet-name">MetaMask</div>
                  {!metamaskAvailable && <div className="wallet-note">Install first</div>}
                </motion.button>
              </div>
            </div>

            <div className="wallet-section">
              <div className="wallet-section-title">More wallets</div>
              <div className="wallet-more">
                <a href="https://phantom.app/download" target="_blank" rel="noreferrer">Get Phantom</a>
                <span> · </span>
                <a href="https://backpack.app/downloads" target="_blank" rel="noreferrer">Get Backpack</a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConnectWalletModal;

