import { 
  Building2, 
  User, 
  FileText, 
  Truck, 
  Package, 
  Calendar,
  CreditCard,
  DollarSign,
  MessageCircle
} from 'lucide-react';

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

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  // Check which fields have data to display
  const hasBasicInfo = company.name && company.name !== '';
  const hasState = company.stateName && company.stateName !== '';
  const hasBillingAddress = company.billingAddress && company.billingAddress !== '';
  const hasShippingAddress = company.shippingAddress && company.shippingAddress !== '';
  const hasGstNumber = company.gstNumber && company.gstNumber !== '';
  const hasContactPerson = company.contactPerson && company.contactPerson !== '';
  const hasWhatsappNumber = company.whatsappNumber && company.whatsappNumber !== '';
  const hasProducts = company.productsWeSell && company.productsWeSell !== '';
  const hasLastPurchaseDate = company.lastPurchaseDate && company.lastPurchaseDate !== '';
  const hasAverageOrderCycle = company.averageOrderCycle && company.averageOrderCycle !== '';
  const hasPaymentTerm = company.paymentTerm && company.paymentTerm !== '';
  const hasCreditLimit = company.creditLimit && company.creditLimit !== '';
  const hasCrmName = company.crmName && company.crmName !== '';

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {company.name || 'Unnamed Company'}
            </h2>
            {hasProducts && (
              <p className="text-blue-100 text-sm md:text-base font-medium">
                {company.productsWeSell}
              </p>
            )}
            {hasState && (
              <p className="text-blue-200 text-sm mt-1">
                {company.stateName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Contact Information */}
        {(hasContactPerson || hasWhatsappNumber) && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hasContactPerson && (
                <InfoItem 
                  icon={User} 
                  label="Contact Person" 
                  value={company.contactPerson!} 
                />
              )}
              {hasWhatsappNumber && (
                <InfoItem 
                  icon={MessageCircle} 
                  label="WhatsApp Number" 
                  value={company.whatsappNumber!} 
                  isLink 
                  href={`https://wa.me/${company.whatsappNumber!.replace(/\D/g, '')}`}
                />
              )}
            </div>
          </div>
        )}

        {/* Business Details */}
        {(hasGstNumber || hasLastPurchaseDate || hasAverageOrderCycle || hasPaymentTerm || hasCreditLimit || hasCrmName) && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Business Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hasGstNumber && (
                <InfoItem 
                  icon={FileText} 
                  label="GST Number" 
                  value={company.gstNumber!} 
                />
              )}
              {hasLastPurchaseDate && (
                <InfoItem 
                  icon={Calendar} 
                  label="Last Purchase Date" 
                  value={company.lastPurchaseDate!} 
                />
              )}
              {hasAverageOrderCycle && (
                <InfoItem 
                  icon={Calendar} 
                  label="Average Order Cycle" 
                  value={company.averageOrderCycle!} 
                />
              )}
              {hasPaymentTerm && (
                <InfoItem 
                  icon={CreditCard} 
                  label="Payment Term" 
                  value={company.paymentTerm!} 
                />
              )}
              {hasCreditLimit && (
                <InfoItem 
                  icon={DollarSign} 
                  label="Credit Limit" 
                  value={company.creditLimit!} 
                />
              )}
              {hasCrmName && (
                <InfoItem 
                  icon={User} 
                  label="CRM Handler" 
                  value={company.crmName!} 
                />
              )}
            </div>
          </div>
        )}

        {/* Address Information */}
        {(hasBillingAddress || hasShippingAddress) && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasBillingAddress && (
                <InfoItem 
                  icon={FileText} 
                  label="Billing Address" 
                  value={company.billingAddress!} 
                />
              )}
              {hasShippingAddress && (
                <InfoItem 
                  icon={Truck} 
                  label="Shipping Address" 
                  value={company.shippingAddress!} 
                />
              )}
            </div>
          </div>
        )}

        {/* Products Information */}
        {hasProducts && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              Products & Services
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoItem 
                icon={Package} 
                label="Products We Sell" 
                value={company.productsWeSell!} 
              />
            </div>
          </div>
        )}

        {/* Company Description */}
        {company.description && company.description !== '' && (
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
              About
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {company.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

const InfoItem = ({ icon: Icon, label, value, isLink, href }: InfoItemProps) => {
  const content = (
    <div className="flex items-start gap-3 group">
      <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
        <p className={`text-sm md:text-base font-medium break-words ${
          isLink ? 'text-blue-600 hover:text-blue-700 hover:underline' : 'text-gray-900'
        }`}>
          {value}
        </p>
      </div>
    </div>
  );

  if (isLink && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};