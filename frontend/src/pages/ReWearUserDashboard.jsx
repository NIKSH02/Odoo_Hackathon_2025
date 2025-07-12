import React, { useState } from 'react';
import { 
  User, 
  Star, 
  Package, 
  ArrowUpDown, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Settings,
  LogOut,
  Camera,
  TrendingUp,
  Award,
  Shirt,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReWearUserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    points: 150,
    totalSwaps: 23,
    rating: 4.8,
    joinDate: 'March 2024',
    avatar: null
  });

  const navigate = useNavigate()

  const [myListings] = useState([
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      category: 'Outerwear',
      size: 'M',
      condition: 'Good',
      points: 25,
      status: 'active',
      views: 45,
      likes: 12,
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      title: 'Summer Floral Dress',
      category: 'Dresses',
      size: 'S',
      condition: 'Excellent',
      points: 30,
      status: 'pending',
      views: 23,
      likes: 8,
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      title: 'Designer Handbag',
      category: 'Accessories',
      size: 'One Size',
      condition: 'Like New',
      points: 45,
      status: 'active',
      views: 67,
      likes: 15,
      image: '/api/placeholder/150/150'
    },
    {
      id: 4,
      title: 'Casual Sneakers',
      category: 'Shoes',
      size: '8',
      condition: 'Good',
      points: 20,
      status: 'swapped',
      views: 34,
      likes: 6,
      image: '/api/placeholder/150/150'
    }
  ]);

  const [swapHistory] = useState([
    {
      id: 1,
      type: 'swap',
      itemGiven: 'Blue Sweater',
      itemReceived: 'Black Jeans',
      partner: 'Emma Wilson',
      date: '2024-07-08',
      status: 'completed',
      points: 0
    },
    {
      id: 2,
      type: 'redeem',
      itemGiven: null,
      itemReceived: 'Leather Boots',
      partner: 'ReWear Store',
      date: '2024-07-05',
      status: 'completed',
      points: -35
    },
    {
      id: 3,
      type: 'swap',
      itemGiven: 'Summer Dress',
      itemReceived: 'Denim Jacket',
      partner: 'Lisa Chen',
      date: '2024-07-10',
      status: 'pending',
      points: 0
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-gray-600 text-gray-200';
      case 'pending': return 'bg-gray-700 text-gray-300';
      case 'swapped': return 'bg-gray-800 text-gray-400';
      case 'completed': return 'bg-gray-600 text-gray-200';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'active': return <Eye className="w-4 h-4 text-gray-400" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAddItem = () => {
    navigate('/list')
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "gray" }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-l-gray-400">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full bg-gray-700">
          <Icon className="w-6 h-6 text-gray-300" />
        </div>
      </div>
    </div>
  );

  const ItemCard = ({ item }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-700">
      <div className="aspect-square bg-gray-700 flex items-center justify-center">
        <Shirt className="w-12 h-12 text-gray-500" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2">{item.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{item.category}</span>
          <span className="text-sm font-medium text-gray-300">{item.points} pts</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-500">Size: {item.size}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>{item.views} views</span>
          <span>{item.likes} likes</span>
        </div>
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md text-sm hover:bg-gray-500 transition-colors">
            <Eye className="w-4 h-4 inline mr-1" />
            View
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Star} 
          title="ReWear Points" 
          value={user.points} 
          subtitle="Available to spend"
          color="blue"
        />
        <StatCard 
          icon={ArrowUpDown} 
          title="Total Swaps" 
          value={user.totalSwaps} 
          subtitle="Successful exchanges"
          color="green"
        />
        <StatCard 
          icon={Package} 
          title="Active Listings" 
          value={myListings.filter(item => item.status === 'active').length} 
          subtitle="Currently available"
          color="purple"
        />
        <StatCard 
          icon={Award} 
          title="Rating" 
          value={user.rating} 
          subtitle="Community rating"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handleAddItem} className="flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add New Item</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
            <Package className="w-5 h-5" />
            <span>Browse Items</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {swapHistory.slice(0, 3).map(swap => (
            <div key={swap.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
              {getStatusIcon(swap.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {swap.type === 'swap' ? 'Item Swap' : 'Points Redemption'}
                </p>
                <p className="text-sm text-gray-400">
                  {swap.type === 'swap' 
                    ? `Swapped ${swap.itemGiven} for ${swap.itemReceived} with ${swap.partner}`
                    : `Redeemed ${swap.itemReceived} for ${Math.abs(swap.points)} points`
                  }
                </p>
              </div>
              <span className="text-xs text-gray-500">{swap.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Listings</h2>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button onClick={handleAddItem} className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {myListings.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  const renderSwapHistory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Swap History</h2>
      
      <div className="bg-gray-700 text-gray-300 rounded-lg shadow-md p-4 overflow-hidden">
        <div className="overflow-x-auto rounded-lg " >
          <table className="w-full ">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-600 rounded-lg">
              {swapHistory.map(swap => (
                <tr key={swap.id} className="space-x-4">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4 rounded-lg">
                      {swap.type === 'swap' ? (
                        <ArrowUpDown className="w-5 h-5 text-white-600 mr-2" />
                      ) : (
                        <Package className="w-5 h-5 text-white-600 mr-2 rounded-lg" />
                      )}
                      <span className="text-sm font-medium text-white capitalize">
                        {swap.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <div className="text-sm text-white ">
                      {swap.type === 'swap' 
                        ? `${swap.itemGiven} ↔ ${swap.itemReceived}`
                        : `Redeemed ${swap.itemReceived}`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 rounded-xl">{swap.partner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{swap.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${swap.points > 0 ? 'text-green-600' : swap.points < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {swap.points !== 0 ? `${swap.points > 0 ? '+' : ''}${swap.points}` : '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{user.name}</h3>
            <p className="text-white">{user.email}</p>
            <p className="text-sm text-white">Member since {user.joinDate}</p>
            <button className="mt-2 flex items-center space-x-2 text-white hover:text-white/50 ">
              <Camera className="w-4 h-4" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white text-white "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location-Country
            </label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location-State
            </label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location-PinCode
            </label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-white mb-2">
            Address
          </label>
          <textarea
            rows={4}
            placeholder="Share Your Address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-white rounded-md bg-gradient-to-r bg-gradient-to-br from-black via-gray-800 to-gray-500 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-gray-900" />
                </div>
                <span className="text-xl font-bold text-white">ReWear</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium text-gray-300">{user.points} points</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">{user.name}</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-200">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-200">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="bg-gray-800 rounded-lg shadow-lg p-4 space-y-2 border border-gray-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'listings' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>My Listings</span>
              </button>
              <button
                onClick={() => setActiveTab('swaps')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'swaps' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <ArrowUpDown className="w-5 h-5" />
                <span>Swap History</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'listings' && renderMyListings()}
            {activeTab === 'swaps' && renderSwapHistory()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReWearUserDashboard;