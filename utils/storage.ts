import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { Property, User, Document, Expense } from '../types';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    address: 'QNN 10, Conjunto 12, Casa 23',
    type: 'House',
    rooms: 4,
    bathrooms: 3,
    garageSpaces: 2,
    city: 'Brasília',
    state: 'DF',
    acquisitionDate: '2023-02-15',
    value: 950000,
    utilities: {
      energy: {
        provider: 'Neoenergia',
        registrationNumber: '11223344',
      },
      water: {
        provider: 'CAESB',
        registrationNumber: '44556677',
      },
    },
    documents: [
      {
        id: '1',
        name: 'Escritura.pdf',
        type: 'Deed',
        uploadDate: '2023-02-20',
        fileUrl: 'https://example.com/escritura.pdf',
      },
    ],
    expenses: [
      {
        id: '1',
        propertyId: '1',
        type: 'Energy',
        description: 'Conta de luz - Fevereiro',
        value: 220.50,
        dueDate: '2023-03-10',
        isPaid: true,
      },
    ],
  },
  {
    id: '2',
    address: 'QRS 6, Bloco G, Casa 9',
    type: 'House',
    rooms: 5,
    bathrooms: 4,
    garageSpaces: 3,
    city: 'Brasília',
    state: 'DF',
    acquisitionDate: '2022-09-22',
    value: 1300000,
    utilities: {
      energy: {
        provider: 'Neoenergia',
        registrationNumber: '99887766',
      },
      water: {
        provider: 'CAESB',
        registrationNumber: '11223355',
      },
    },
    documents: [],
    expenses: [
      {
        id: '2',
        propertyId: '2',
        type: 'Water',
        description: 'Conta de água - Março',
        value: 130.40,
        dueDate: '2023-04-05',
        isPaid: false,
      },
      {
        id: '3',
        propertyId: '2',
        type: 'Tax',
        description: 'IPTU 2023',
        value: 4200,
        dueDate: '2023-04-15',
        isPaid: false,
        installments: {
          current: 4,
          total: 10,
        },
      },
    ],
  },
  {
    id: '3',
    address: 'SQWN 107 Bloco I, Casa 10, Asa Sul',
    type: 'House',
    rooms: 7,
    bathrooms: 6,
    garageSpaces: 4,
    city: 'Brasília',
    state: 'DF',
    acquisitionDate: '2024-03-10',
    value: 3500000,
    utilities: {
      energy: {
        provider: 'Neoenergia',
        registrationNumber: '55667788',
      },
      water: {
        provider: 'CAESB',
        registrationNumber: '88990011',
      },
    },
    documents: [
      {
        id: '3',
        name: 'Contrato de Compra e Venda.pdf',
        type: 'Contract',
        uploadDate: '2024-03-12',
        fileUrl: 'https://example.com/contrato.pdf',
      },
    ],
    expenses: [
      {
        id: '7',
        propertyId: '3',
        type: 'Energy',
        description: 'Conta de luz - Março',
        value: 600.00,
        dueDate: '2024-04-01',
        isPaid: false,
      },
      {
        id: '8',
        propertyId: '3',
        type: 'Water',
        description: 'Conta de água - Março',
        value: 250.00,
        dueDate: '2024-04-05',
        isPaid: false,
      },
      {
        id: '9',
        propertyId: '3',
        type: 'Tax',
        description: 'IPTU 2024',
        value: 12000,
        dueDate: '2024-04-10',
        isPaid: false,
        installments: {
          current: 1,
          total: 12,
        },
      },
    ],
  },
];

export const storage = {
  // Auth
  login: async (email: string, senha: string): Promise<User> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      senha,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    const { token, user } = response.data;
    
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<void> => {
    const { name, email, password } = userData;

    const response = await api.post<RegisterResponse>('/auth/register', {
      nome: name,
      email,
      senha: password
    });

    if (response.error) {
      throw new Error(response.error);
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },

  getUser: async (): Promise<User | null> => {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  
  getProperties: (): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProperties);
      }, 500);
    });
  },
  
  getPropertyById: (id: string): Promise<Property | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const property = mockProperties.find(p => p.id === id);
        resolve(property);
      }, 300);
    });
  },
  
  saveProperty: (property: Omit<Property, 'id'>): Promise<Property> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProperty = {
          ...property,
          id: Date.now().toString(),
        };
        mockProperties.push(newProperty as Property);
        resolve(newProperty as Property);
      }, 500);
    });
  },
  
  updateProperty: (updatedProperty: Property): Promise<Property> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProperties.findIndex(p => p.id === updatedProperty.id);
        if (index !== -1) {
          mockProperties[index] = updatedProperty;
        }
        resolve(updatedProperty);
      }, 500);
    });
  },
  
  getExpenses: (): Promise<Expense[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allExpenses = mockProperties.flatMap(p => p.expenses);
        resolve(allExpenses);
      }, 300);
    });
  },
  
  getPropertyExpenses: (propertyId: string): Promise<Expense[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const property = mockProperties.find(p => p.id === propertyId);
        resolve(property?.expenses || []);
      }, 300);
    });
  },
  
  getPropertyDocuments: (propertyId: string): Promise<Document[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const property = mockProperties.find(p => p.id === propertyId);
        resolve(property?.documents || []);
      }, 300);
    });
  },
};