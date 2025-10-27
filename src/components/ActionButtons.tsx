import { X, Download } from 'lucide-react';

interface ActionButtonsProps {
  onClear: () => void;
  onDownloadPDF: () => void;
  hasResults: boolean;
}

export const ActionButtons = ({ onClear, onDownloadPDF, hasResults }: ActionButtonsProps) => {
  if (!hasResults) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClear}
          className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <X className="w-5 h-5" />
          <span>Clear Results</span>
        </button>
        <button
          onClick={onDownloadPDF}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};
