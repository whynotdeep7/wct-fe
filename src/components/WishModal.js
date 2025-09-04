import React, { useState } from 'react';

const WishModal = ({ pixel, onClose, onPurchase, account, onCopyAddress }) => {
  const [wishText, setWishText] = useState('');
  const [color, setColor] = useState('#ff6b6b');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wishText.trim()) {
      alert('Please enter a wish text');
      return;
    }

    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onPurchase({
        wishText: wishText.trim(),
        color
      });
    } catch (error) {
      console.error('Error submitting wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setWishText('');
    setColor('#ff6b6b');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {pixel.isPurchased ? 'View Wish' : 'Purchase Pixel'}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {pixel.isPurchased ? (
            // Display existing wish
            <div className="wish-display">
              <div className="pixel-preview">
                <div 
                  className="preview-pixel"
                  style={{ backgroundColor: pixel.color }}
                >
                  <span className="wish-icon">✨</span>
                </div>
              </div>
              
              <div className="wish-content">
                <h3>Wish:</h3>
                <p className="wish-text">{pixel.wishText}</p>
                
                <h3>Owner:</h3>
                <div className="wallet-address-section">
                  <span className="wallet-address">
                    {pixel.walletAddress}
                  </span>
                  <button 
                    className="copy-btn"
                    onClick={() => onCopyAddress(pixel.walletAddress)}
                  >
                    Copy Address
                  </button>
                </div>
                
                <div className="fulfill-instructions">
                  <p>
                    <strong>To fulfill this wish:</strong><br />
                    Send cryptocurrency to the wallet address above.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Purchase form
            <div className="purchase-form">
              {!account ? (
                <div className="wallet-required">
                  <p>Please connect your wallet to purchase this pixel.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="wishText">Your Wish:</label>
                    <textarea
                      id="wishText"
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      placeholder="What is your wish? Be creative and meaningful..."
                      rows={4}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="color">Pixel Color:</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        disabled={isSubmitting}
                      />
                      <span className="color-preview" style={{ backgroundColor: color }}>
                        {color}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Wallet Address:</label>
                    <input
                      type="text"
                      value={account}
                      readOnly
                      className="readonly-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="cancel-btn"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting || !wishText.trim()}
                    >
                      {isSubmitting ? 'Purchasing...' : 'Submit Wish'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishModal;