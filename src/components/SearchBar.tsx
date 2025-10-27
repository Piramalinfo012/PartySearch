import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

interface Suggestion {
  partyName: string;
}

// Fetch suggestions from Google Sheets
async function fetchSuggestions(searchTerm: string): Promise<Suggestion[]> {
  if (!searchTerm.trim() || searchTerm.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbyzGAhuT63tIIgyKKu_nZz_EjUpUSonMw6fFLjzRdnb_Te7ReYBaV36A89UknMYGRrW/exec?sheet=Data`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    const data = result.data;
    if (!data || data.length < 2) return [];

    const headers = data[0].map((header: string) => header.toString().toLowerCase());
    const rows = data.slice(1);
    
    // Find party name column - more flexible search
    const partyNameIndex = headers.findIndex(header => 
      header.includes('party') || header.includes('name') || header.includes('company')
    );
    
    // If no specific column found, try to find any column that might contain names
    if (partyNameIndex === -1) {
      // Look for common column names that might contain company/party names
      const possibleNameColumns = headers.findIndex(header => 
        header.includes('title') || header.includes('entity') || header.includes('firm')
      );
      if (possibleNameColumns !== -1) {
        return [];
      }
      // If still not found, use the first column as fallback
      console.warn('No party name column found, using first column as fallback');
    }

    const columnIndex = partyNameIndex !== -1 ? partyNameIndex : 0;

    // Filter suggestions that contain the search term (case insensitive)
    const suggestions = rows
      .map((row: any[]) => row[columnIndex]?.toString().trim() || '') // Ensure string and trim
      .filter((name: string) => {
        if (!name) return false; // Skip empty names
        const lowerName = name.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase().trim(); // Trim search term
        return lowerName.includes(lowerSearch);
      })
      .filter((name: string, index: number, self: string[]) => 
        name && self.indexOf(name) === index
      )
      .sort((a: string, b: string) => a.localeCompare(b))
      .slice(0, 8)
      .map((name: string) => ({ partyName: name }));

    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch,
  isLoading = false
}: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when search term changes
  useEffect(() => {
    const getSuggestions = async () => {
      // Show suggestions when user types 1 or more characters
      if (searchTerm.trim().length >= 1) {
        setIsFetchingSuggestions(true);
        const data = await fetchSuggestions(searchTerm);
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setIsFetchingSuggestions(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSearchChange(suggestion.partyName);
    setShowSuggestions(false);
  };

  const toggleSuggestions = () => {
    if (searchTerm.trim().length >= 1 && suggestions.length > 0) {
      setShowSuggestions(!showSuggestions);
    }
  };

  // Highlight matching part of the suggestion
  const highlightMatch = (suggestion: string, searchTerm: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase().trim();
    
    const matchIndex = lowerSuggestion.indexOf(lowerSearch);
    
    if (matchIndex !== -1) {
      const beforeMatch = suggestion.substring(0, matchIndex);
      const matchedPart = suggestion.substring(matchIndex, matchIndex + searchTerm.length);
      const afterMatch = suggestion.substring(matchIndex + searchTerm.length);
      
      return (
        <>
          <span>{beforeMatch}</span>
          <span className="font-semibold text-blue-600">{matchedPart}</span>
          <span>{afterMatch}</span>
        </>
      );
    }
    
    return <span>{suggestion}</span>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <label htmlFor="company-search" className="block text-sm font-semibold text-gray-700 mb-3">
          Search Company by Name
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="relative">
              <input
                id="company-search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  // Show suggestions when user types 1 or more characters
                  if (e.target.value.trim().length >= 1) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => {
                  if (searchTerm.trim().length >= 1 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Start typing company name..."
                className="w-full px-5 py-3.5 pr-12 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                disabled={isLoading}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              
              {/* Suggestions dropdown toggle */}
              {searchTerm.trim().length >= 1 && suggestions.length > 0 && (
                <button
                  type="button"
                  onClick={toggleSuggestions}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showSuggestions ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {isFetchingSuggestions ? (
                  <div className="p-3 text-center text-gray-500">
                    <div className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading suggestions...
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="py-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 flex items-center gap-3"
                        >
                          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {highlightMatch(suggestion.partyName, searchTerm)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-center text-gray-500">
                    No companies containing "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setShowSuggestions(false);
              onSearch();
            }}
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
          {searchTerm.trim().length >= 1 
           ?"" // ? `Showing companies containing "${searchTerm}"` 
            : 'Type 1 or more characters to see suggestions'
          }
        </p>
      </div>
    </div>
  );
};