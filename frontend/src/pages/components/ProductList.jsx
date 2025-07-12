import React, { useState } from 'react';

export default function ProductList() {
  const [favorites, setFavorites] = useState(new Set());

  // Sample product data matching your Item model schema
  const products = [
    {
      _id: "507f1f77bcf86cd799439011",
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket from Levi's, barely worn. Perfect for layering in any season.",
      images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Women",
      subCategory: "casual",
      size: "M",
      condition: "like-new",
      pointsCost: 150,
      status: "available",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439012",
        username: "sarah_m",
        email: "sarah@example.com"
      },
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      _id: "507f1f77bcf86cd799439013",
      title: "Summer Floral Dress",
      description: "Beautiful floral print sundress from Zara, perfect for summer occasions and casual outings.",
      images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Women",
      subCategory: "party",
      size: "S",
      condition: "good",
      pointsCost: 120,
      status: "available",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439014",
        username: "emma_l",
        email: "emma@example.com"
      },
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-10T14:20:00Z"
    },
    {
      _id: "507f1f77bcf86cd799439015",
      title: "Black Leather Boots",
      description: "Authentic Dr. Martens leather boots, comfortable and stylish for everyday wear.",
      images: ["https://images.unsplash.com/photo-1608256246200-53e8b47b82d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Women",
      subCategory: "casual",
      size: "8",
      condition: "good",
      pointsCost: 180,
      status: "available",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439016",
        username: "alex_r",
        email: "alex@example.com"
      },
      createdAt: "2024-01-12T09:15:00Z",
      updatedAt: "2024-01-12T09:15:00Z"
    },
    {
      _id: "507f1f77bcf86cd799439017",
      title: "Casual White Sneakers",
      description: "Clean white Adidas sneakers, great for everyday wear and sports activities.",
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Men",
      subCategory: "sports",
      size: "10",
      condition: "good",
      pointsCost: 100,
      status: "available",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439018",
        username: "mike_t",
        email: "mike@example.com"
      },
      createdAt: "2024-01-08T16:45:00Z",
      updatedAt: "2024-01-08T16:45:00Z"
    },
    {
      _id: "507f1f77bcf86cd799439019",
      title: "Designer Evening Dress",
      description: "Elegant black evening dress, perfect for formal events and special occasions.",
      images: ["https://images.unsplash.com/photo-1566479179817-c04b62b2d46f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Women",
      subCategory: "formal",
      size: "M",
      condition: "new",
      pointsCost: 250,
      status: "swapped",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439020",
        username: "jessica_k",
        email: "jessica@example.com"
      },
      createdAt: "2024-01-14T11:30:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    },
    {
      _id: "507f1f77bcf86cd799439021",
      title: "Navy Blue Blazer",
      description: "Professional Hugo Boss blazer, perfect for office wear and formal business meetings.",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"],
      category: "Men",
      subCategory: "formal",
      size: "L",
      condition: "like-new",
      pointsCost: 200,
      status: "available",
      approved: true,
      listedBy: {
        _id: "507f1f77bcf86cd799439022",
        username: "david_p",
        email: "david@example.com"
      },
      createdAt: "2024-01-11T13:10:00Z",
      updatedAt: "2024-01-11T13:10:00Z"
    }
  ];

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

  // Filter only approved and available items for display
  const availableProducts = products.filter(product => product.approved);
  
  // Show only first 4 items for home page display
  const displayProducts = availableProducts.slice(0, 4);

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Available Items</h2>
        <div className="text-sm text-gray-500">
          Showing {displayProducts.filter(p => p.status === 'available').length} of {availableProducts.filter(p => p.status === 'available').length} items available for swap
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayProducts.map((product) => (
          <div 
            key={product._id} 
            className={`bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:border-gray-300 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden group cursor-pointer transform hover:scale-[1.02] ${
              product.status !== 'available' ? 'opacity-75' : ''
            }`}
            onClick={() => console.log('Card clicked:', product.title)}
          >
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
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
                <span className="px-3 py-1 text-xs font-medium bg-black/80 group-hover:bg-black text-white rounded-full shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
              {/* Title and Sub-category */}
              <div className="mb-2">
                <h3 className="font-bold text-gray-900 truncate text-base group-hover:text-black transition-colors duration-300">{product.title}</h3>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{getSubCategoryLabel(product.subCategory)} • Size {product.size}</p>
              </div>

              {/* Condition Badge */}
              <div className="mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full transform group-hover:scale-105 transition-all duration-300 shadow-sm ${getConditionColor(product.condition)}`}>
                  {getConditionLabel(product.condition)}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                {product.description}
              </p>

              {/* Points Cost */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 group-hover:bg-white rounded-lg transition-colors duration-300">
                <div className="flex items-center space-x-1">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">💎</span>
                  <span className="font-bold text-gray-900 text-base group-hover:text-black transition-colors duration-300">{product.pointsCost}</span>
                  <span className="text-xs text-gray-500 font-medium">points</span>
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{formatDate(product.createdAt)}</span>
              </div>

              {/* Listed By */}
              <div className="text-xs text-gray-500 mb-3 group-hover:text-gray-600 transition-colors duration-300">
                <span className="font-medium">Listed by @{product.listedBy.username}</span>
              </div>

              {/* Action Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Button clicked:', product.title);
                }}
                className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  product.status === 'available'
                    ? 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={product.status !== 'available'}
              >
                {product.status === 'available' 
                  ? 'Request Swap' 
                  : product.status === 'pending' 
                  ? 'Swap Pending' 
                  : 'Already Swapped'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Browse All Button */}
      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95">
          Browse All Items ({availableProducts.filter(p => p.status === 'available').length} total)
        </button>
      </div>
    </section>
  );
}