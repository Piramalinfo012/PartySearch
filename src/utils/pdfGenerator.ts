import jsPDF from 'jspdf';

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  headquarters: string;
  employees: string;
  revenue: string;
  founded_year: number;
  ceo: string;
  website: string;
  email: string;
  phone: string;
  stateName?: string;
  billingAddress?: string;
  shippingAddress?: string;
  gstNumber?: string;
  contactPerson?: string;
  whatsappNumber?: string;
  productsWeSell?: string;
  lastPurchaseDate?: string;
  averageOrderCycle?: string;
  paymentTerm?: string;
  creditLimit?: string;
  crmName?: string;
}

export const generatePDF = (companies: Company[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = 20;

  // Add header
  doc.setFillColor(59, 130, 246); // Blue color
  doc.rect(0, 0, pageWidth, 12, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Party Search Report', margin, 8);

  yPosition = 25;

  // Report info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
  doc.text(`Total Results: ${companies.length}`, pageWidth - margin - 30, yPosition);

  yPosition += 12;

  companies.forEach((company, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      yPosition = 20;
    }

    // Company header with background
    doc.setFillColor(243, 244, 246); // Light gray
    doc.rect(margin, yPosition - 3, pageWidth - (margin * 2), 8, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}. ${company.name}`, margin + 5, yPosition + 2);

    yPosition += 12;

    // Helper function to add fields
    const addField = (label: string, value: string | number | null | undefined) => {
      if (value && String(value).trim() !== '' && yPosition < pageHeight - 25) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(75, 85, 99); // Gray-600
        doc.text(`${label}:`, margin, yPosition);

        const labelWidth = doc.getTextWidth(`${label}: `);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const lines = doc.splitTextToSize(String(value), maxWidth - labelWidth - 5);

        lines.forEach((line: string, i: number) => {
          if (i === 0) {
            doc.text(line, margin + labelWidth, yPosition);
          } else {
            yPosition += 4;
            if (yPosition > pageHeight - 25) {
              addFooter(doc, pageWidth, pageHeight);
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, margin + labelWidth, yPosition);
          }
        });

        yPosition += 6;
      }
    };

    // Basic Information
    addField('Industry', company.industry);
    addField('State', company.stateName);
    addField('Headquarters', company.headquarters);
    addField('Contact Person', company.contactPerson);
    addField('Phone', company.phone);
    addField('WhatsApp', company.whatsappNumber);

    // Business Details
    addField('GST Number', company.gstNumber);
    addField('Products', company.productsWeSell);
    addField('Last Purchase Date', company.lastPurchaseDate);
    addField('Average Order Cycle', company.averageOrderCycle);
    addField('Payment Term', company.paymentTerm);
    addField('Credit Limit', company.creditLimit);
    addField('CRM Handler', company.crmName);

    // Address Information
    addField('Billing Address', company.billingAddress);
    addField('Shipping Address', company.shippingAddress);

    // Company Description
    if (company.description && company.description.trim() !== '' && yPosition < pageHeight - 25) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(75, 85, 99);
      doc.text('Description:', margin, yPosition);
      yPosition += 4;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const descLines = doc.splitTextToSize(company.description, maxWidth);

      descLines.forEach((line: string) => {
        if (yPosition > pageHeight - 25) {
          addFooter(doc, pageWidth, pageHeight);
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 4;
      });
    }

    // Add separator line between companies
    if (index < companies.length - 1) {
      yPosition += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }
  });

  // Add final footer
  addFooter(doc, pageWidth, pageHeight);

  // Save the PDF
  doc.save(`party-search-results-${new Date().getTime()}.pdf`);
};

// Helper function to add footer to each page
const addFooter = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  const footerY = pageHeight - 10;
  
  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
  
  // Footer text
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 100, 100);

// Left side - Page number
doc.text(`Page ${doc.getNumberOfPages()}`, 15, footerY);

// Center - Powered by Botivate
const footerText = 'Powered by Botivate';
const textWidth = doc.getTextWidth(footerText);
doc.text(footerText, (pageWidth - textWidth) / 2, footerY);

// Right side - Generation timestamp on first page only
if (doc.getNumberOfPages() === 1) {
  const timestamp = `Generated: ${new Date().toLocaleString()}`;
  const timestampWidth = doc.getTextWidth(timestamp);
  doc.text(timestamp, pageWidth - 15 - timestampWidth, footerY);
}
};