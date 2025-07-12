export default function SearchBar() {
  return (
    <div className="max-w-3xl mx-auto px-6 my-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for clothing items, brands, or categories..."
          className="w-full border rounded-full py-3 px-5 pr-14 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black">
          🔍
        </button>
      </div>
    </div>
  );
}
