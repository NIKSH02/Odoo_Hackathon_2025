import React, { useState, useEffect } from 'react';
import { Camera, X, Plus, Upload, Tag, Shirt, Package, Star, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ItemService from '../services/itemService';
import { useAuth } from '../hooks/useAuth';

export default function AddItemForm() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    size: '',
    condition: '',
    pointsCost: ''
  });
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userItems, setUserItems] = useState([]);
  const [loadingUserItems, setLoadingUserItems] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Load user's recent items
  useEffect(() => {
    const loadUserItems = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoadingUserItems(true);
        const response = await ItemService.getUserItems();
        if (response && response.data) {
          setUserItems(Array.isArray(response.data) ? response.data.slice(0, 4) : []);
        }
      } catch (error) {
        console.error('Error loading user items:', error);
      } finally {
        setLoadingUserItems(false);
      }
    };

    loadUserItems();
  }, [isAuthenticated]);

  const categories = [
    'Men',
    'Women', 
    'Kids',
    'Accessories',
    'Shoes'
  ];

  const subCategories = {
    Men: ['casual', 'formal', 'sportswear', 'outerwear'],
    Women: ['casual', 'formal', 'sportswear', 'outerwear', 'dresses'],
    Kids: ['casual', 'formal', 'sportswear', 'outerwear'],
    Accessories: ['bags', 'jewelry', 'watches', 'belts'],
    Shoes: ['casual', 'formal', 'sportswear', 'boots']
  };

  const conditions = [
    'like-new', 'excellent', 'good', 'fair'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 
    '6', '7', '8', '9', '10', '11', '12'
  ];

  const handleImageUpload = (files) => {
    if (!files || files.length === 0) {
      return;
    }
    
    const newImages = Array.from(files).slice(0, 6 - images.length);
    
    const imageUrls = newImages.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || 
          !formData.subCategory || !formData.size || !formData.condition || 
          !formData.pointsCost || images.length === 0) {
        setError('Please fill in all required fields and add at least one image');
        return;
      }

      // Prepare data object for the service
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        size: formData.size,
        condition: formData.condition,
        pointsCost: parseInt(formData.pointsCost),
        images: images.map(image => image.file)
      };

      // Submit to backend
      await ItemService.createItem(itemData);
      
      // Navigate to browse or dashboard on success
      navigate('/browse', { replace: true });
      
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error.response?.data?.message || 'Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrow = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft onClick={handleArrow}  className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-gray-300 via-gray-800 to-black bg-clip-text text-transparent">
                ReWear
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-black-600" />
                <span className="text-sm font-medium text-gray-700">245 Points</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-300 via-gray-800 to-black rounded-full flex items-center justify-center">
                <span className="text-white font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">List a New Item</h2>
          <p className="text-gray-600">Share your preloved fashion and earn points for sustainable swapping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-black-600" />
                  Photos ({images.length}/6)
                </h3>
                
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragOver 
                      ? 'border-black-500 bg-gray-100' 
                      : 'border-gray-300 hover:border-black-500 hover:bg-gray-50'
                  } ${images.length >= 6 ? 'opacity-50 pointer-events-none' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Drag & drop images here, or click to browse</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 6}
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block mt-4 px-6 py-2 text-white rounded-lg cursor-pointer bg-gradient-to-br from-gray-500 via-gray-800 to-black"
                  >
                    Choose Files
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Previous Listings Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Your Recent Listings</h3>
                
                {loadingUserItems ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-gray-100 rounded-lg p-3 animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : userItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {userItems.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 overflow-hidden">
                          {item.images && item.images[0] ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Shirt className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.pointsCost} points</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shirt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No items listed yet</p>
                    <p className="text-gray-400 text-xs">Your recent listings will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-black-600" />
                  Item Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="e.g., Vintage Levi's Denim Jacket"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          handleInputChange('category', e.target.value);
                          handleInputChange('subCategory', ''); // Reset subcategory when category changes
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                      <select
                        value={formData.subCategory}
                        onChange={(e) => handleInputChange('subCategory', e.target.value)}
                        disabled={!formData.category}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100"
                      >
                        <option value="">Select Subcategory</option>
                        {formData.category && subCategories[formData.category]?.map(subCat => (
                          <option key={subCat} value={subCat}>{subCat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                      <select
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Select Size</option>
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points Cost *</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.pointsCost}
                        onChange={(e) => handleInputChange('pointsCost', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="e.g., 50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {conditions.map((condition) => (
                        <button
                          key={condition}
                          type="button"
                          onClick={() => handleInputChange('condition', condition)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                            formData.condition === condition
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                          }`}
                        >
                          {condition === 'like-new' ? 'Like New' : 
                           condition === 'excellent' ? 'Excellent' : 
                           condition === 'good' ? 'Good' : 'Fair'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Describe the item's condition, style, fit, and any unique features..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Ready to List?</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">Earn 10 points</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Your item will be reviewed and approved within 24 hours.</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-br from-gray-500 via-gray-800 to-black text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'List Item'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}