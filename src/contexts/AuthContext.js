import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletType, setWalletType] = useState(localStorage.getItem('walletType') || null);

  // Set default authorization header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Check for existing wallet connection
  useEffect(() => {
    const savedWalletAddress = localStorage.getItem('walletAddress');
    const savedWalletType = localStorage.getItem('walletType');
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      setWalletConnected(true);
      if (savedWalletType) setWalletType(savedWalletType);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      
      toast.success('Account created successfully! Please log in.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // EVM: MetaMask
  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return { success: false, error: 'MetaMask not installed' };
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        setWalletType('evm-metamask');
        localStorage.setItem('walletAddress', accounts[0]);
        localStorage.setItem('walletType', 'evm-metamask');
        toast.success('Connected: MetaMask');
        return { success: true, address: accounts[0] };
      } else {
        return { success: false, error: 'No accounts found' };
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
      return { success: false, error: error.message };
    }
  };

  // Solana: Phantom
  const connectPhantom = async () => {
    const provider = window?.solana;
    if (!provider?.isPhantom) {
      toast.error('Phantom wallet not found');
      return { success: false, error: 'Phantom not found' };
    }
    try {
      await provider.connect();
      const address = provider.publicKey?.toBase58();
      if (!address) return { success: false, error: 'No publicKey' };
      setWalletAddress(address);
      setWalletConnected(true);
      setWalletType('solana-phantom');
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletType', 'solana-phantom');
      toast.success('Connected: Phantom');
      return { success: true, address };
    } catch (error) {
      toast.error('Failed to connect Phantom');
      return { success: false, error: error.message };
    }
  };

  // Solana: Backpack
  const connectBackpack = async () => {
    const provider = window?.backpack?.solana;
    if (!provider) {
      toast.error('Backpack wallet not found');
      return { success: false, error: 'Backpack not found' };
    }
    try {
      await provider.connect();
      const address = provider.publicKey?.toBase58();
      if (!address) return { success: false, error: 'No publicKey' };
      setWalletAddress(address);
      setWalletConnected(true);
      setWalletType('solana-backpack');
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletType', 'solana-backpack');
      toast.success('Connected: Backpack');
      return { success: true, address };
    } catch (error) {
      toast.error('Failed to connect Backpack');
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletConnected(false);
    setWalletType(null);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
    toast.info('Wallet disconnected');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setWalletAddress(null);
    setWalletConnected(false);
    setWalletType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletType');
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    walletAddress,
    walletConnected,
    walletType,
    connectMetaMask,
    connectPhantom,
    connectBackpack,
    disconnectWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};