// data/mockData.ts
export interface Company {
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
  
  // Google Sheets specific fields
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

// export const mockCompanies: Company[] = [
//   {
//     id: '1',
//     name: 'Botivate',
//     industry: 'Technology & AI Solutions',
//     founded_year: 2019,
//     headquarters: 'San Francisco, CA, USA',
//     employees: '150-200 employees',
//     revenue: '$25M - $50M annually',
//     website: 'https://www.botivate.com',
//     description: 'Botivate is a leading artificial intelligence and automation company specializing in conversational AI, chatbot development, and intelligent business process automation. The company provides enterprise-grade solutions that help businesses automate customer service, streamline operations, and enhance user engagement through cutting-edge AI technology. Botivate serves clients across various industries including finance, healthcare, e-commerce, and technology, offering customized AI solutions that drive efficiency and innovation.',
//     ceo: 'Sarah Johnson',
//     email: 'contact@botivate.com',
//     phone: '+1 (415) 555-0123',
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: '2',
//     name: 'Botivate Labs',
//     industry: 'Software Development & Research',
//     founded_year: 2020,
//     headquarters: 'Austin, TX, USA',
//     employees: '75-100 employees',
//     revenue: '$15M - $20M annually',
//     website: 'https://www.botivate.io',
//     description: 'A subsidiary of Botivate focusing on custom software development and mobile application solutions. This branch specializes in creating innovative mobile apps, web platforms, and cloud-based services for startups and established enterprises. The team combines deep technical expertise with creative problem-solving to deliver cutting-edge digital solutions.',
//     ceo: 'Michael Chen',
//     email: 'info@botivate.io',
//     phone: '+1 (512) 555-0456',
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: '3',
//     name: 'Botivate Analytics',
//     industry: 'Data Analytics & Business Intelligence',
//     founded_year: 2021,
//     headquarters: 'New York, NY, USA',
//     employees: '50-75 employees',
//     revenue: '$10M - $15M annually',
//     website: 'https://analytics.botivate.com',
//     description: 'Botivate Analytics specializes in big data analytics, business intelligence solutions, and predictive analytics for enterprise clients. The company helps organizations make data-driven decisions through advanced analytics platforms, custom dashboards, and machine learning models that uncover valuable insights from complex datasets.',
//     ceo: 'Emily Rodriguez',
//     email: 'analytics@botivate.com',
//     phone: '+1 (212) 555-0789',
//     created_at: new Date().toISOString(),
//   },
// ];
