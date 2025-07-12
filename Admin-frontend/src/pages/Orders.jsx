import { useState, useEffect } from "react";
import {
  XCircleIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { getAllOrders, cancelOrder } from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrders();
      setOrders(response.data.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
      toast.error("Failed to fetch orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const handleDeleteOrder = async (orderID) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrder(orderID);
      toast.success("Order cancelled successfully");

      // Remove the cancelled order from the state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderID)
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    const matchesSearch =
      (order.orderID &&
        order.orderID.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.name &&
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user?.email &&
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orders Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="accepted">Accepted</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table for ReWear */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    From User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    To User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Points Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.orderID}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.orderID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.type === "swap" ? "Swap" : "Points Redemption"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.item?.title || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.fromUser?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.fromUser?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.toUser?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.toUser?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 dark:text-indigo-300 font-semibold">
                      {order.pointsUsed || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "delivered"
                          ? "Delivered"
                          : order.status === "cancelled"
                          ? "Cancelled"
                          : "Accepted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteOrder(order.orderID)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            {error ? (
              <div className="space-y-4">
                <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Failed to Load Orders
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {error}
                </p>
                <button
                  onClick={fetchOrders}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="space-y-4">
                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  No orders have been placed yet. Orders will appear here once
                  users start making swaps and redemptions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  No Orders Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery
                    ? `No orders match your search "${searchQuery}"`
                    : filterStatus !== "all"
                    ? `No orders found with status "${filterStatus}"`
                    : "No orders found matching your current filters"}
                </p>
                {(searchQuery || filterStatus !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
