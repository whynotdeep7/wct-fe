import React from 'react';
import { motion } from 'framer-motion';

const Pixel = ({ pixelData, onClick, size = 'small' }) => {
  const handleClick = () => {
    onClick(pixelData);
  };

  const pixelSize = size === 'large' ? '12px' : '8px';
  const fontSize = size === 'large' ? '8px' : '6px';

  return (
    <motion.div
      className={`pixel ${pixelData.isPurchased ? 'purchased' : 'available'}`}
      style={{ 
        backgroundColor: pixelData.color,
        width: pixelSize,
        height: pixelSize,
        fontSize: fontSize
      }}
      onClick={handleClick}
      whileHover={{ 
        scale: 1.2,
        zIndex: 10,
        boxShadow: '0 0 8px rgba(0,0,0,0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      title={
        pixelData.hasWish 
          ? `Wish: ${pixelData.wishText || 'No wish text'}` 
          : 'Click to submit a wish for this pixel'
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {pixelData.hasWish && (
        <motion.div 
          className="pixel-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="wish-icon">✨</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Pixel;