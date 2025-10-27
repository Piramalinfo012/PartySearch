import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { CompanyCard } from './components/CompanyCard';
import { ActionButtons } from './components/ActionButtons';
import { generatePDF } from './utils/pdfGenerator';
import { Database, AlertCircle } from 'lucide-react';

interface CompanyData {
  partyName: string;
  stateName: string;
  billingAddress: string;
  shippingAddress: string;
  gstNumber: string;
  contactPerson: string;
  whatsappNumber: string;
  productsWeSell: string;
  lastPurchaseDate: string;
  averageOrderCycle: string;
  paymentTerm: string;
  creditLimit: string;
  crmName: string;
}

// Convert Google Sheets data to Company type for the card
function convertToCompany(data: CompanyData, id: number) {
  return {
    id: id.toString(),
    name: data.partyName || '',
    industry: data.productsWeSell || '',
    description: `Company based in ${data.stateName || ''}. ${data.contactPerson ? `Contact: ${data.contactPerson}` : ''}`,
    headquarters: data.billingAddress || data.stateName || '',
    employees: '',
    revenue: data.creditLimit ? `Credit Limit: ${data.creditLimit}` : '',
    founded_year: new Date().getFullYear(),
    ceo: data.contactPerson || '',
    website: '',
    email: '',
    phone: data.whatsappNumber || '',
    // Google Sheets specific fields
    stateName: data.stateName,
    billingAddress: data.billingAddress,
    shippingAddress: data.shippingAddress,
    gstNumber: data.gstNumber,
    contactPerson: data.contactPerson,
    whatsappNumber: data.whatsappNumber,
    productsWeSell: data.productsWeSell,
    lastPurchaseDate: data.lastPurchaseDate,
    averageOrderCycle: data.averageOrderCycle,
    paymentTerm: data.paymentTerm,
    creditLimit: data.creditLimit,
    crmName: data.crmName
  };
}

// Direct fetch function to get data from Google Apps Script
async function fetchSheetData(sheetName: string) {
  try {
    console.log('Fetching data from sheet:', sheetName);
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbyYNIuF7JDFSNlD-rV2t_KDsipkgqvPDLCeR5ut7R_eq5BchO7XiRbx91x-366ggmN-/exec?sheet=${encodeURIComponent(sheetName)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Raw API response:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

// Search function that filters data by party name
function searchCompaniesByName(data: any[][], searchTerm: string): CompanyData[] {
  console.log('Searching for:', searchTerm);
  console.log('Raw data received:', data);
  
  if (!data || data.length < 2) {
    console.log('No data or insufficient rows');
    return [];
  }

  const headers = data[0].map(header => header.toString());
  console.log('Headers found:', headers);
  
  const rows = data.slice(1);
  console.log('Number of data rows:', rows.length);
  
  // More flexible column index finding
  const findColumnIndex = (possibleNames: string[]): number => {
    for (const name of possibleNames) {
      const index = headers.findIndex(header => 
        header.toLowerCase().includes(name.toLowerCase())
      );
      if (index !== -1) {
        console.log(`Found column "${name}" at index ${index}`);
        return index;
      }
    }
    console.log(`Column not found for: ${possibleNames}`);
    return -1;
  };

  // Map column indices with multiple possible names
  const partyNameIndex = findColumnIndex(['Party Name', 'party name', 'Party', 'party']);
  const stateNameIndex = findColumnIndex(['State Name', 'state name', 'State', 'state']);
  const billingAddressIndex = findColumnIndex(['Billing address', 'billing address', 'Billing', 'billing']);
  const shippingAddressIndex = findColumnIndex(['Shipping address', 'shipping address', 'Shipping', 'shipping']);
  const gstNumberIndex = findColumnIndex(['Gst Number', 'gst number', 'GST', 'gst']);
  const contactPersonIndex = findColumnIndex(['Contact Person', 'contact person', 'Contact', 'contact']);
  const whatsappNumberIndex = findColumnIndex(['Whatsapp Number Contact Person', 'whatsapp number', 'WhatsApp', 'whatsapp']);
  const productsWeSellIndex = findColumnIndex(['Products We Sell', 'products we sell', 'Products', 'products']);
  const lastPurchaseDateIndex = findColumnIndex(['Last Purchase Date', 'last purchase date', 'Last Purchase']);
  const averageOrderCycleIndex = findColumnIndex(['Average Order Cycle', 'average order cycle', 'Order Cycle']);
  const paymentTermIndex = findColumnIndex(['Payment Term', 'payment term', 'Payment']);
  const creditLimitIndex = findColumnIndex(['Credit Litmit', 'credit limit', 'Credit Limit', 'Credit']);
  const crmNameIndex = findColumnIndex(['Crm Name Who Handle The Customer', 'crm name', 'CRM']);

  // If we can't find the party name column, try to use first column as fallback
  const searchColumnIndex = partyNameIndex !== -1 ? partyNameIndex : 0;
  console.log('Using search column index:', searchColumnIndex);

  // Filter rows by party name match
  const matchingRows = rows.filter((row, index) => {
    const companyName = row[searchColumnIndex] || '';
    const matches = companyName.toString().toLowerCase().includes(searchTerm.toLowerCase());
    if (matches) {
      console.log(`Match found at row ${index + 2}:`, companyName);
    }
    return matches;
  });

  console.log(`Found ${matchingRows.length} matching rows`);

  // Convert to CompanyData objects
  const results = matchingRows.map((row, index) => {
    const companyData: CompanyData = {
      partyName: row[searchColumnIndex] || '',
      stateName: stateNameIndex !== -1 ? row[stateNameIndex] || '' : '',
      billingAddress: billingAddressIndex !== -1 ? row[billingAddressIndex] || '' : '',
      shippingAddress: shippingAddressIndex !== -1 ? row[shippingAddressIndex] || '' : '',
      gstNumber: gstNumberIndex !== -1 ? row[gstNumberIndex] || '' : '',
      contactPerson: contactPersonIndex !== -1 ? row[contactPersonIndex] || '' : '',
      whatsappNumber: whatsappNumberIndex !== -1 ? row[whatsappNumberIndex] || '' : '',
      productsWeSell: productsWeSellIndex !== -1 ? row[productsWeSellIndex] || '' : '',
      lastPurchaseDate: lastPurchaseDateIndex !== -1 ? row[lastPurchaseDateIndex] || '' : '',
      averageOrderCycle: averageOrderCycleIndex !== -1 ? row[averageOrderCycleIndex] || '' : '',
      paymentTerm: paymentTermIndex !== -1 ? row[paymentTermIndex] || '' : '',
      creditLimit: creditLimitIndex !== -1 ? row[creditLimitIndex] || '' : '',
      crmName: crmNameIndex !== -1 ? row[crmNameIndex] || '' : ''
    };
    
    console.log(`Processed company ${index + 1}:`, companyData.partyName);
    return companyData;
  });

  return results;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);
    setResults([]);

    try {
      console.log('Starting search for:', searchTerm);
      
      // Fetch all data from the "Data" sheet
      const sheetData = await fetchSheetData('Data');
      
      if (!sheetData || sheetData.length === 0) {
        console.log('No sheet data received');
        setResults([]);
        return;
      }

      console.log('Sheet data loaded, rows:', sheetData.length);
      
      // Search for companies matching the search term
      const matchingCompanies = searchCompaniesByName(sheetData, searchTerm);
      
      console.log('Matching companies:', matchingCompanies);
      
      if (matchingCompanies.length === 0) {
        setResults([]);
      } else {
        // Convert to Company type for display
        const convertedResults = matchingCompanies.map((data, index) => 
          convertToCompany(data, index + 1)
        );
        setResults(convertedResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError(`Failed to search companies: ${error}. Please check your connection and try again.`);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setSearchError(null);
  };

  const handleDownloadPDF = () => {
    if (results.length > 0) {
      generatePDF(results);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <Database className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Party Search
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
            Search companies by name from our database
          </p>
        </div>

        <div className="space-y-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            isLoading={isSearching}
          />

          {searchError && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Search Error</h3>
                <p className="text-red-700">{searchError}</p>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Searching companies...</p>
              </div>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && !searchError && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">No Results Found</h3>
                <p className="text-amber-700">
                  No companies found matching "{searchTerm}". Please try a different search term.
                </p>
              </div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <>
              {/* <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-900 font-semibold">
                    Found {results.length} {results.length === 1 ? 'company' : 'companies'} matching "{searchTerm}"
                  </p>
                </div>
              </div> */}

              {/* <ActionButtons
                onClear={handleClear}
                onDownloadPDF={handleDownloadPDF}
                hasResults={results.length > 0}
              /> */}

              <div className="max-w-4xl mx-auto space-y-6">
                {results.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>

              <ActionButtons
                onClear={handleClear}
                onDownloadPDF={handleDownloadPDF}
                hasResults={results.length > 0}
              />
            </>
          )}
        </div>
      </div>

      <footer className="mt-16 py-8 text-center text-gray-500 text-sm border-t-2 border-gray-250">
        <p> Powered by Botivate</p>
      </footer>
    </div>
  );
}

export default App;