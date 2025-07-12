import React, { useState } from 'react';

export default function Categories() {
  const [selectedGender, setSelectedGender] = useState("ALL");
  
  const genderOptions = ["ALL", "MEN", "WOMEN", "KIDS"];
  
  const items = [
    { name: "Tops", icon: "👕", emoji: "👕" },
    { name: "Bottoms", icon: "👖", emoji: "👖" },
    { name: "Dresses", icon: "👗", emoji: "👗" },
    { name: "Jackets", icon: "🧥", emoji: "🧥" },
    { name: "Shoes", icon: "👟", emoji: "👟" },
    { name: "Accessories", icon: "👜", emoji: "👜" }
  ];

  return (
    <section className="px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Categories</h2>
        
        {/* Gender Dropdown */}
        <div className="absolute ml-40">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent hover:border-gray-400 transition-colors"
          >
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option === "ALL" ? "All Categories" : option}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-100 text-black py-6 text-center rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg"
          >
            {/* Icon */}
            <div className="text-3xl mb-2 transition-transform duration-300 hover:scale-110">
              {item.emoji}
            </div>
            
            {/* Gender label */}
            <div className="text-xs text-gray-500 mb-1">
              {selectedGender !== "ALL" ? selectedGender : "All"}
            </div>
            
            {/* Category name */}
            <div className="text-sm font-semibold">
              {item.name}
            </div>
          </div>
        ))}
      </div>

     
    </section>
  );
}
