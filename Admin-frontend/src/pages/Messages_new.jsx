import { useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const Messages = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and respond to user messages
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-6">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Messages Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            The messaging system is currently under development. You'll be able
            to view and respond to user messages once this feature is
            implemented.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Coming Features:</strong>
              <br />• View user inquiries and feedback
              <br />• Respond to messages directly
              <br />• Message status management
              <br />• Real-time notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
