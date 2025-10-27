import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch,
  isLoading = false
}: SearchBarProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <label htmlFor="company-search" className="block text-sm font-semibold text-gray-700 mb-3">
          Search Company by Name
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              id="company-search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter company name to search..."
              className="w-full px-5 py-3.5 pr-12 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
              disabled={isLoading}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
          <button
            onClick={onSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="sm:w-auto w-full px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Search will find companies with names containing your search term
        </p>
      </div>
    </div>
  );
};