export interface InstallationCase {
  id: string;
  title: string;
  description: string;
  englishDescription?: string;
  imageUrl: string;
  status: 'Online' | 'Maintenance' | 'Offline';
  category: string; // e.g. 'Cafe', 'Lobby', 'Retail'
  location?: string;
  specs?: string;
  createdAt: string;
}

export interface RentalInquiry {
  id: string;
  name: string;
  phone: string;
  company: string;
  quantity: string;
  installationTime: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Completed';
  createdAt: string;
  storeImages?: string[];
}

export interface HardwareItem {
  id: string;
  name: string;
  type: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}
