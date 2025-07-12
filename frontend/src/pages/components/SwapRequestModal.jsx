import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import SwapService from '../../services/swapService';

const SwapRequestModal = ({ selectedProduct, userListings, onClose, onSwapRequested }) => {
  const [selectedUserItem, setSelectedUserItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [swapId, setSwapId] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedUserItem(item);
    setError('');
  };

  const handleSendSwapRequest = async () => {
    if (!selectedUserItem) {
      setError('Please select an item to offer');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await SwapService.requestSwap({
        itemOffered: selectedUserItem._id,
        itemRequested: selectedProduct._id
      });

      if (response.success) {
        setSuccess('Swap request sent successfully!');
        setSwapId(response.data._id);
        if (onSwapRequested) onSwapRequested();
        
        // Auto close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(error.message || 'Failed to send swap request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !swapId) return;

    try {
      await SwapService.sendSwapMessage(swapId, newMessage.trim());
      setMessages(prev => [...prev, {
        id: Date.now(),
        message: newMessage.trim(),
        sender: 'You',
        timestamp: new Date()
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!selectedProduct) return null;

  return (
    <div className="text-white">
      {/* Header */}
      <div className="border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">Request Swap</h2>
        <p className="text-gray-300">Select an item from your listings to offer in exchange</p>
      </div>

      {success ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">Swap Request Sent!</h3>
          <p className="text-gray-300">The item owner will be notified of your request.</p>
        </motion.div>
      ) : (
        <>
          {/* Selected Product Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">You want to get:</h3>
            <div className="flex items-center space-x-4">
              <img 
                src={selectedProduct?.images[0]} 
                alt={selectedProduct?.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium">{selectedProduct?.title}</h4>
                <p className="text-sm text-gray-400">{selectedProduct?.category} • Size {selectedProduct?.size}</p>
                <p className="text-sm text-yellow-400">💎 {selectedProduct?.pointsCost} points</p>
                <p className="text-xs text-gray-500">
                  Listed by @{selectedProduct?.listedBy?.username || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* User's Listings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Items Available for Swap:</h3>
              <span className="text-sm text-gray-400">{userListings.length} items</span>
            </div>

            {userListings.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="w-12 h-12 text-gray-500 mx-auto mb-4">📦</div>
                <p className="text-gray-400 mb-2">No items in your listings</p>
                <p className="text-gray-500 text-sm">Add your first item to start swapping</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                {userListings.map((item) => (
                  <motion.div
                    key={item._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedUserItem?._id === item._id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => handleSelectItem(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400 mb-2">{item.category} • Size {item.size}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-400">💎 {item.pointsCost} points</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.condition === 'like-new' ? 'bg-green-100 text-green-800' :
                        item.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.condition}
                      </span>
                    </div>
                    {selectedUserItem?._id === item._id && (
                      <div className="mt-3 flex items-center text-blue-400 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selected
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Send Request Button */}
          {selectedUserItem && (
            <motion.div 
              className="border-t border-gray-700 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-3">Swap Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">You give:</p>
                    <p className="font-medium">{selectedUserItem.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">You get:</p>
                    <p className="font-medium">{selectedProduct.title}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSendSwapRequest}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Swap Request</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default SwapRequestModal;
