import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const WishSubmissionModal = ({ pixel, onClose, onWishSubmitted }) => {
  const { walletAddress, walletConnected, walletType, connectPhantom, connectBackpack, connectMetaMask } = useAuth();
  const [formData, setFormData] = useState({
    wishText: '',
    color: '#6366f1',
    walletAddress: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get the correct network name based on wallet type
  const getNetworkName = () => {
    if (!walletType) return 'wallet';
    if (walletType.includes('solana')) return 'Solana';
    if (walletType.includes('evm')) return 'Ethereum';
    return 'wallet';
  };

  // Auto-fill wallet address if connected
  useEffect(() => {
    if (walletConnected && walletAddress) {
      setFormData(prev => ({
        ...prev,
        walletAddress: walletAddress
      }));
    }
  }, [walletConnected, walletAddress]);

  // Handle wallet connection from within the modal
  const handleConnectWallet = async () => {
    // Prefer Solana (Phantom, then Backpack), fallback to MetaMask
    let res = null;
    if (window?.solana?.isPhantom) {
      res = await connectPhantom();
    }
    if (!res?.success && window?.backpack?.solana) {
      res = await connectBackpack();
    }
    if (!res?.success && window?.ethereum) {
      res = await connectMetaMask();
    }

    if (res?.success && res.address) {
      setFormData(prev => ({
        ...prev,
        walletAddress: res.address
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.wishText.trim()) {
      toast.error('Please enter a wish text');
      return;
    }

    if (!formData.walletAddress.trim()) {
      toast.error('Please enter your wallet address');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('wishText', formData.wishText.trim());
      submitData.append('color', formData.color);
      submitData.append('walletAddress', formData.walletAddress.trim());
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await api.post(`/pixels/submit-wish/${pixel.pixelId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Wish submitted successfully!');
      onWishSubmitted(response.data.pixel);
      onClose();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to submit wish';
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          className="modal-content wish-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Submit Your Wish for Pixel #{pixel.pixelId}</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="pixel-preview">
              <div 
                className="preview-pixel"
                style={{ backgroundColor: formData.color }}
              >
                <span className="pixel-number">#{pixel.pixelId}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="wish-form">
              <div className="form-group">
                <label htmlFor="wishText">Your Wish *</label>
                <textarea
                  id="wishText"
                  name="wishText"
                  value={formData.wishText}
                  onChange={handleChange}
                  placeholder="Share your wish, dream, or message with the world..."
                  rows={4}
                  required
                  disabled={loading}
                />
                <small>Maximum 500 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="color">Pixel Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="color-preview" style={{ backgroundColor: formData.color }}>
                    {formData.color}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="walletAddress">Wallet Address *</label>
                {walletConnected ? (
                  <div className="wallet-connected">
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="0x..."
                      required
                      disabled={loading}
                      className="connected-input"
                    />
                    <span className="wallet-status">✅ Connected</span>
                  </div>
                ) : (
                  <div className="wallet-not-connected">
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="0x..."
                      required
                      disabled={loading}
                    />
                    <motion.button
                      type="button"
                      className="connect-wallet-in-form"
                      onClick={handleConnectWallet}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Connect Wallet
                    </motion.button>
                  </div>
                )}
                <small>Your {getNetworkName()} wallet address for receiving donations</small>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image (Optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <small>Upload an image to accompany your wish (max 5MB)</small>
              </div>

              <div className="form-actions">
                <motion.button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !formData.wishText.trim() || !formData.walletAddress.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Submitting...' : 'Submit Wish'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WishSubmissionModal;