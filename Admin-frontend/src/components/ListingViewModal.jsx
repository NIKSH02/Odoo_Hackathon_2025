import React from "react";
import BaseModal from "../components/BaseModal";

const ListingViewModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={item.title}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {item.images && item.images.length > 0 ? (
            item.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="item"
                className="h-20 w-20 object-cover rounded border"
              />
            ))
          ) : (
            <span className="text-xs text-gray-400">No Images</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Category:{" "}
            </span>
            {item.category}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              SubCategory:{" "}
            </span>
            {item.subCategory}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Size:{" "}
            </span>
            {item.size}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Condition:{" "}
            </span>
            {item.condition}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Status:{" "}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                item.status === "available"
                  ? "bg-green-100 text-green-800"
                  : item.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : item.status === "swapped"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {item.status === "available"
                ? "Available"
                : item.status === "pending"
                ? "Pending"
                : item.status === "swapped"
                ? "Swapped"
                : item.status}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Listed By:{" "}
            </span>
            {item.uploader && item.uploader.name ? item.uploader.name : "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Created At:{" "}
            </span>
            {new Date(item.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Approved:{" "}
            </span>
            {item.approved ? (
              <span className="px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-semibold">
                Yes
              </span>
            ) : (
              <span className="px-2 py-1 rounded bg-red-200 text-red-800 text-xs font-semibold">
                No
              </span>
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ListingViewModal;
