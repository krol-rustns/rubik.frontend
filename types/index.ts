export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface Property {
  id: string;
  address: string;
  type: 'Apartment' | 'House' | 'Commercial' | 'Land' | 'Other';
  rooms: number;
  bathrooms: number;
  garageSpaces: number;
  city: string;
  state: string;
  acquisitionDate: string;
  value: number;
  utilities: {
    energy: {
      provider: string;
      registrationNumber: string;
    };
    water: {
      provider: string;
      registrationNumber: string;
    };
  };
  documents: Document[];
  expenses: Expense[];
}

export interface Document {
  id: string;
  name: string;
  type: 'Contract' | 'Deed' | 'Certificate' | 'Insurance' | 'Other';
  uploadDate: string;
  fileUrl: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  type: 'Energy' | 'Water' | 'Tax' | 'Maintenance' | 'Insurance' | 'Other';
  description: string;
  value: number;
  dueDate: string;
  isPaid: boolean;
  installments?: {
    current: number;
    total: number;
  };
}