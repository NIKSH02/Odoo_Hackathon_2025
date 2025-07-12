import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import PointsService from '../../services/pointsService';
import { useAuth } from '../../hooks/useAuth';

const PurchaseConfirmationModal = ({ selectedProduct, onClose, onPurchaseComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;

    // Check if user has enough points
    if (user?.points < selectedProduct.pointsCost) {
      setError('Insufficient points for this purchase');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await PointsService.redeemItem(selectedProduct._id);
      
      if (response.success) {
        setSuccess(true);
        if (onPurchaseComplete) onPurchaseComplete();
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      setError(error.message || 'Failed to process purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedProduct) return null;

  return (
    <div className="text-white">
      {success ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">Purchase Successful!</h3>
          <p className="text-gray-300 mb-4">
            You have successfully purchased <strong>{selectedProduct.title}</strong>
          </p>
          <p className="text-sm text-gray-400">
            The item owner will be contacted for delivery arrangements.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <div className="border-b border-gray-700 pb-4 mb-6">
            <h2 className="text-2xl font-bold mb-2">Purchase with Points</h2>
            <p className="text-gray-300">Confirm your purchase details</p>
          </div>

          {/* Product Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedProduct.images[0]} 
                alt={selectedProduct.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{selectedProduct.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{selectedProduct.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">{selectedProduct.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Size {selectedProduct.size}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{selectedProduct.condition}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-yellow-400 text-lg">💎</span>
                  <span className="text-xl font-bold text-yellow-400">{selectedProduct.pointsCost}</span>
                  <span className="text-sm text-gray-400">points</span>
                </div>
                <span className="text-sm text-gray-400">
                  Listed by @{selectedProduct?.listedBy?.username || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h4 className="font-semibold mb-3 text-gray-200">Purchase Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Item Cost:</span>
                <span className="text-white">{selectedProduct.pointsCost} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Transaction Fee:</span>
                <span className="text-white">0 points</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-400 flex items-center space-x-1">
                    <span>💎</span>
                    <span>{selectedProduct.pointsCost} points</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Points Balance */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-200">Your Points Balance:</span>
              </div>
              <span className="text-yellow-400 font-semibold flex items-center space-x-1">
                <span>💎</span>
                <span>{user?.points || 0} points</span>
              </span>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-400">
                Remaining after purchase: {Math.max(0, (user?.points || 0) - selectedProduct.pointsCost)} points
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Points Check Warning */}
          {user?.points < selectedProduct.pointsCost && (
            <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500 text-yellow-400 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>
                You need {selectedProduct.pointsCost - (user?.points || 0)} more points for this purchase
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPurchase}
              disabled={isProcessing || !user || user.points < selectedProduct.pointsCost}
              className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>💎</span>
                  <span>Confirm Purchase</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchaseConfirmationModal;
