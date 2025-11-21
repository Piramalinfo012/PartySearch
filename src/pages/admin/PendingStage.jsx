import React, { useState, useEffect, useRef } from "react";
import { Search, Building, User, Phone, Package, Clock, FileText, MessageSquare, CheckCircle, Hash, Calendar, Loader2, ChevronDown, X, Download } from "lucide-react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyzGAhuT63tIIgyKKu_nZz_EjUpUSonMw6fFLjzRdnb_Te7ReYBaV36A89UknMYGRrW/exec";

const PendingStagesDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [partyNames, setPartyNames] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = partyNames.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredParties(filtered);
    } else {
      setFilteredParties(partyNames);
    }
  }, [searchQuery, partyNames]);

  const fetchPendingOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SCRIPT_URL}?sheet=Pending Stage`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 1) {
        const rows = result.data.slice(1);
        const orderList = rows.filter(row => row[0] && row[0].toString().trim() !== "").map((row, idx) => ({
          id: idx,
          uniqueNumber: row[0] || "",
          planned: row[1] || "",
          step: row[2] || "",
          who: row[3] || "",
          materialName: row[4] || "",
          qty: row[5] || "",
          contactNumber: row[6] || "",
          stageDuration: row[7] || "",
          remarks: row[8] || "",
          status: row[9] || "",
          partyName: row[10] || ""
        }));
        setOrders(orderList);
        const uniqueParties = [...new Set(orderList.map(o => o.partyName).filter(p => p.trim() !== ""))];
        setPartyNames(uniqueParties);
        setFilteredParties(uniqueParties);
      } else {
        setError("No data found in sheet");
      }
    } catch (err) {
      setError("Failed to fetch data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedPartyName(e.target.value);
    setIsDropdownOpen(true);
    if (selectedOrders.length > 0) setSelectedOrders([]);
  };

  const handleSelectParty = (party) => {
    setSelectedPartyName(party);
    setSearchQuery(party);
    setIsDropdownOpen(false);
    setSelectedOrders([]);
  };

  const handleSearch = () => {
    if (!selectedPartyName.trim()) return;
    const matched = orders.filter(o => o.partyName.toLowerCase() === selectedPartyName.toLowerCase());
    setSelectedOrders(matched);
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedPartyName("");
    setSelectedOrders([]);
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complete") || s.includes("done")) return "bg-green-100 text-green-700";
    if (s.includes("pending") || s.includes("progress")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("delay") || s.includes("hold")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const downloadPDF = () => {
    if (selectedOrders.length === 0) return;
    
    // Using jsPDF library via CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      const now = new Date();
      const generatedDate = now.toLocaleDateString('en-US', { 
        month: '2-digit', day: '2-digit', year: 'numeric' 
      }) + ', ' + now.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      });
      
      // Title
      doc.setFontSize(18);
      doc.setTextColor(35, 99, 179);
      doc.text('Pending Stages Report', 105, 15, { align: 'center' });
      
      // Header info
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated: ${generatedDate}`, 10, 25);
      doc.text(`Party Name: ${selectedPartyName}`, 10, 31);
      doc.text(`Total Pending Stages: ${selectedOrders.length}`, 10, 37);
      
      doc.line(10, 40, 200, 40);
      
      let yPos = 48;
      const pageHeight = 280;
      
      selectedOrders.forEach((order, index) => {
        // Check if we need a new page
        if (yPos > pageHeight) {
          doc.addPage();
          yPos = 15;
        }
        
        // Order header
        doc.setFontSize(11);
        doc.setTextColor(35, 99, 179);
        doc.text(`Order #${index + 1}`, 10, yPos);
        yPos += 6;
        
        // Order details
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        const details = [
          { label: 'Unique Number:', value: order.uniqueNumber || '-' },
          { label: 'Planned:', value: order.planned || '-' },
          { label: 'Step:', value: order.step || '-' },
          { label: 'Who:', value: order.who || '-' },
          { label: 'Material Name:', value: order.materialName || '-' },
          { label: 'Qty:', value: order.qty || '-' },
          { label: 'Contact Number:', value: order.contactNumber || '-' },
          { label: 'Stage Duration:', value: order.stageDuration || '-' },
          { label: 'Status:', value: order.status || '-' },
          { label: 'Remarks:', value: order.remarks || '-' }
        ];
        
        details.forEach(detail => {
          if (yPos > pageHeight) {
            doc.addPage();
            yPos = 15;
          }
          
          doc.setFont(undefined, 'bold');
          doc.text(detail.label, 10, yPos);
          doc.setFont(undefined, 'normal');
          
          // Handle long text wrapping
          const textValue = detail.value.toString();
          const maxWidth = 120;
          const lines = doc.splitTextToSize(textValue, maxWidth);
          doc.text(lines, 50, yPos);
          yPos += (lines.length * 5);
        });
        
        yPos += 3;
        doc.line(10, yPos, 200, yPos);
        yPos += 5;
      });
      
      // Save the PDF
      doc.save(`${selectedPartyName.replace(/[^a-zA-Z0-9]/g, '_')}_Pending_Stages_Report.pdf`);
    };
    
    document.head.appendChild(script);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <h1 className="text-base font-semibold text-gray-700 mb-3">Pending Stages - Search by Party Name</h1>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
              <span className="text-gray-600">Loading data...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
              <button onClick={fetchPendingOrders} className="ml-2 text-blue-600 underline">Retry</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1" ref={dropdownRef}>
                <div className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white cursor-pointer flex items-center" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <input type="text" placeholder="Select or search party..." value={searchQuery} onChange={handleInputChange} onKeyPress={handleKeyPress} onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(true); }} className="flex-1 outline-none text-sm bg-transparent" />
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredParties.length > 0 ? filteredParties.map((party, idx) => (
                      <div key={idx} className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0" onClick={() => handleSelectParty(party)}>
                        <div className="font-medium text-gray-800">{party}</div>
                      </div>
                    )) : (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">No parties found</div>
                    )}
                  </div>
                )}
              </div>
              <button onClick={handleSearch} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          )}
        </div>

        {selectedOrders.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-5 py-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><Building className="w-6 h-6 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedPartyName}</h2>
                  <p className="text-sm text-blue-100">{selectedOrders.length} pending stage(s) found</p>
                </div>
              </div>
            </div>

            {selectedOrders.map((order, idx) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-800">Order #{idx + 1}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>{order.status || "N/A"}</span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0"><Hash className="w-5 h-5 text-indigo-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">UNIQUE NUMBER</p><p className="text-sm font-semibold text-gray-900">{order.uniqueNumber || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Calendar className="w-5 h-5 text-blue-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">PLANNED</p><p className="text-sm font-semibold text-gray-900">{order.planned || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5 text-purple-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">STEP</p><p className="text-sm font-semibold text-gray-900">{order.step || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-green-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">WHO</p><p className="text-sm font-semibold text-gray-900">{order.who || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5 text-orange-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">MATERIAL NAME</p><p className="text-sm font-semibold text-gray-900">{order.materialName || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5 text-cyan-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">QTY</p><p className="text-sm font-semibold text-gray-900">{order.qty || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-pink-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">CONTACT NUMBER</p><p className="text-sm font-semibold text-blue-600">{order.contactNumber || "-"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-yellow-600" /></div>
                      <div><p className="text-xs text-gray-500 font-semibold mb-1">STAGE DURATION</p><p className="text-sm font-semibold text-gray-900">{order.stageDuration || "-"}</p></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0"><MessageSquare className="w-5 h-5 text-teal-600" /></div>
                    <div className="flex-1"><p className="text-xs text-gray-500 font-semibold mb-1">REMARKS</p><p className="text-sm text-gray-700">{order.remarks || "-"}</p></div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={downloadPDF} className="flex-1 px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Download className="w-4 h-4" />Download Report
                </button>
                <button onClick={handleClear} className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <X className="w-4 h-4" />Clear Search
                </button>
              </div>
            </div>
          </div>
        )}

        {searchQuery && selectedOrders.length === 0 && !loading && !isDropdownOpen && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
            <Building className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-2">No Pending Stages Found</h3>
            <p className="text-sm text-gray-500">Select a party from the dropdown and click Search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingStagesDashboard;