import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const WishViewModal = ({ pixel, onClose }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Wallet address copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy address');
    });
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
          className="modal-content wish-view-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Wish # {pixel.pixelId}</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="wish-display">
              <div className="pixel-preview">
                <div 
                  className="preview-pixel large"
                  style={{ backgroundColor: pixel.color }}
                >
                  <span className="wish-icon">✨</span>
                </div>
              </div>
              
              <div className="wish-content">
                <div className="wish-section">
                  <h3>Wish</h3>
                  <p className="wish-text">{pixel.wishText}</p>
                </div>

                {pixel.imageUrl && (
                  <div className="wish-section">
                    <h3>Image</h3>
                    <div className="wish-image">
                      <img src={pixel.imageUrl} alt="Wish" />
                    </div>
                  </div>
                )}
                
                <div className="wish-section">
                  <h3>Owner's Wallet</h3>
                  <div className="wallet-address-section">
                    <span className="wallet-address">
                      {pixel.walletAddress}
                    </span>
                    <motion.button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(pixel.walletAddress)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Copy
                    </motion.button>
                  </div>
                </div>
                
                <div className="fulfill-instructions">
                  <h3>How to Fulfill This Wish</h3>
                  <p>
                    Send cryptocurrency to the wallet address above to help fulfill this wish. 
                    The amount is up to you - every contribution helps make dreams come true!
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <motion.button
                className="close-modal-btn"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WishViewModal;