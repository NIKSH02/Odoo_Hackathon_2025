import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../Modal';
import ItemService from '../../services/itemService';
import SwapRequestModal from './SwapRequestModal';
import PurchaseConfirmationModal from './PurchaseConfirmationModal';

export default function ProductList() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedProductForSwap, setSelectedProductForSwap] = useState(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState(null);
  const [products, setProducts] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await ItemService.getAllItems();
        if (response && response.data) {
          const itemsData = Array.isArray(response.data) ? response.data : [];
          setProducts(itemsData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadUserListings = async () => {
      try {
        const response = await ItemService.getUserItems();
        if (response && response.data) {
          setUserListings(Array.isArray(response.data) ? response.data : []);
        } else {
          setUserListings([]);
        }
      } catch (error) {
        console.error('Error loading user listings:', error);
      }
    };

    loadProducts();
    loadUserListings();
  }, []);

  const handleBrowseAll = () => {
    navigate('/browse');
  };

  const handleRequestSwap = (product) => {
    setSelectedProductForSwap(product);
    setIsSwapModalOpen(true);
  };

  const closeSwapModal = () => {
    setIsSwapModalOpen(false);
    setSelectedProductForSwap(null);
  };

  const handleBuyWithPoints = (product) => {
    setSelectedProductForPurchase(product);
    setIsPurchaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setSelectedProductForPurchase(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { 
      y: -30, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'text-green-700 bg-green-100';
      case 'like-new': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'worn': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionLabel = (condition) => {
    switch (condition) {
      case 'new': return 'New';
      case 'like-new': return 'Like New';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'worn': return 'Worn';
      default: return condition;
    }
  };

  const getSubCategoryLabel = (subCategory) => {
    return subCategory.charAt(0).toUpperCase() + subCategory.slice(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  // Filter available items for display
  const availableProducts = products.filter(product => 
    product.status === 'available' && (product.approved === undefined || product.approved !== false)
  );
  
  // Show only first 4 items for home page display  
  const displayProducts = availableProducts.slice(0, 4);

  if (loading) {
    return (
      <section className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Available Items</h2>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="px-6 py-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-2xl font-semibold"
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Available Items
        </motion.h2>
        <motion.div 
          className="text-sm text-gray-500"
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Showing {displayProducts.filter(p => p.status === 'available').length} of {availableProducts.filter(p => p.status === 'available').length} items available for swap
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {displayProducts.map((product, index) => (
          <motion.div 
            key={product._id} 
            className={`bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:border-gray-300 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden group cursor-pointer transform hover:scale-[1.02] ${
              product.status !== 'available' ? 'opacity-75' : ''
            }`}
            variants={cardVariants}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product._id);
                }}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className={`text-lg transition-all duration-300 ${favorites.has(product._id) ? 'text-red-500 scale-125' : 'text-gray-400 hover:text-red-400'}`}>
                  {favorites.has(product._id) ? '❤️' : '🤍'}
                </span>
              </button>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 transform group-hover:scale-105 transition-transform duration-300">
                <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-lg ${
                  product.status === 'available' 
                    ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                    : product.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                    : 'bg-red-100 text-red-800 group-hover:bg-red-200'
                }`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>

              {/* Category Tag */}
              <div className="absolute bottom-3 left-3 transform group-hover:scale-105 transition-transform duration-300">
                <span className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Title and Description */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                {product.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <span className={`px-2 py-1 rounded-full text-center font-medium ${getConditionColor(product.condition)}`}>
                  {getConditionLabel(product.condition)}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-center font-medium">
                  Size {product.size}
                </span>
              </div>

              {/* Points and Date */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 group-hover:bg-white rounded-lg transition-colors duration-300">
                <div className="flex items-center space-x-1">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">💎</span>
                  <span className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors duration-300">{product.pointsCost}</span>
                  <span className="text-xs text-gray-500 font-medium">points</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{formatDate(product.createdAt)}</span>
              </div>

              {/* Listed By */}
              <div className="text-xs text-gray-500 mb-3 group-hover:text-gray-600 transition-colors duration-300">
                <span className="font-medium">
                  Listed by @{product.listedBy?.username || 'Unknown'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.status === 'available') {
                      handleRequestSwap(product);
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
                    product.status === 'available'
                      ? 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white shadow-lg hover:shadow-xl border-gray-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                  }`}
                  disabled={product.status !== 'available'}
                >
                  {product.status === 'available' 
                    ? 'Request Swap' 
                    : product.status === 'pending' 
                    ? 'Swap Pending' 
                    : 'Already Swapped'}
                </button>
                
                {product.status === 'available' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyWithPoints(product);
                    }}
                    className="w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 border bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl border-blue-600 flex items-center justify-center space-x-2"
                  >
                    <span className="text-base">💎</span>
                    <span>Buy with Points</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Browse All Button */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.button
          onClick={handleBrowseAll}
          className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 overflow-hidden group"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ 
              boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.3)" 
            }}
          />
          
          <motion.span
            className="relative z-10 inline-flex items-center space-x-3"
            whileHover={{ 
              y: -2,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.5 }
              }}
            >
              🔍
            </motion.span>
            <span>Browse All Items ({availableProducts.filter(p => p.status === 'available').length} total)</span>
            <motion.span
              className="inline-block"
              whileHover={{ 
                x: 3,
                transition: { duration: 0.2 }
              }}
            >
              →
            </motion.span>
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Swap Request Modal */}
      <Modal 
        isOpen={isSwapModalOpen} 
        onClose={closeSwapModal}
        maxWidth="max-w-4xl"
      >
        <SwapRequestModal 
          selectedProduct={selectedProductForSwap}
          userListings={userListings}
          onClose={closeSwapModal}
          onSwapRequested={() => {
            // Reload data after swap request
            window.location.reload();
          }}
        />
      </Modal>

      {/* Purchase Confirmation Modal */}
      <Modal 
        isOpen={isPurchaseModalOpen} 
        onClose={closePurchaseModal}
        maxWidth="max-w-md"
      >
        <PurchaseConfirmationModal 
          selectedProduct={selectedProductForPurchase}
          onClose={closePurchaseModal}
          onPurchaseComplete={() => {
            // Reload data after purchase
            window.location.reload();
          }}
        />
      </Modal>
    </motion.section>
  );
}
