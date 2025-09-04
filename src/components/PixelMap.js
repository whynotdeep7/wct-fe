import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Pixel from './Pixel';
import api from '../services/api';
import { toast } from 'react-toastify';

const PixelMap = ({ onPixelClick, selectedPixelId, refreshTrigger }) => {
  const [pixels, setPixels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPixels();
    fetchStats();
  }, [refreshTrigger]);

  const fetchPixels = async () => {
    try {
      const response = await api.get('/pixels');
      setPixels(response.data);
    } catch (error) {
      toast.error('Failed to load pixel map');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/pixels/stats/overview');
      setStats(response.data);
    } catch (error) {
      // Stats are not critical, fail silently
    }
  };

  if (loading) {
    return (
      <div className="pixel-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading pixel map...</p>
      </div>
    );
  }

  return (
    <div className="pixel-map-container">
      {stats && (
        <motion.div 
          className="pixel-stats"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
                <div className="stat-item">
        <span className="stat-number">{stats.pixelsWithWishes}</span>
        <span className="stat-label">With Wishes</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.availablePixels}</span>
        <span className="stat-label">Available</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.wishPercentage}%</span>
        <span className="stat-label">Filled</span>
      </div>
        </motion.div>
      )}

      <motion.div 
        className="pixel-map"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="pixel-grid">
          {pixels.map((pixel) => (
            <Pixel
              key={pixel.pixelId}
              pixelData={pixel}
              onClick={onPixelClick}
              size="small"
            />
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="pixel-map-instructions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Click on any pixel to view wishes</p>
      </motion.div>
    </div>
  );
};

export default PixelMap;