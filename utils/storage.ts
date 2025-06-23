import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { Property, User, Document, Expense, UserData } from '../types';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
}

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

  getUserData: async (): Promise<UserData | null> => {
    const user = await storage.getUser();
    const token = await storage.getToken();

    if (!user) {
      throw new Error('User not found');
    }
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get(`/user/${user.email}/data`, token);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No properties data received');
      }

      return response.data as UserData;
    } catch (error) {
      console.error('Failed to fetch user data', error);
      throw new Error('Failed to fetch user data');
    }
  },
  
  getProperties: async (): Promise<Property[]> => {
    const user = await storage.getUser();
    const token = await storage.getToken();

    if (!user) {
      throw new Error('User not found');
    }
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const emailEncoded = encodeURIComponent(user.email);
      const response = await api.get(`/imovel/user/email?email=${emailEncoded}`, token);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data as Property[];
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      throw new Error('Failed to fetch properties');
    }
  },
  
  getPropertyByCep: async (cep: string): Promise<Property | undefined> => {
    const token = await storage.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get(`/imovel/${cep}`, token);
  
      if (response.error) {
        throw new Error(response.error);
      }
  
      return response.data as Property;
    } catch (error) {
      console.error('Failed to fetch property by CEP:', error);
      throw new Error('Failed to fetch property by CEP');
    }
  },
  
  addProperty: async (propertyData: any): Promise<Property> => {
    const token = await storage.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.post<Property>(`/imovel`, propertyData, token);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data as Property;
    } catch (error) {
      console.error('Failed to add property:', error);
      throw new Error('Failed to add property');
    }
  },
  
  updateProperty: async (updatedProperty: Property, cep: string): Promise<Property> => {
    const token = await storage.getToken();

    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      const response = await api.put<Property>(
        `/imovel/${cep}`,
        updatedProperty,
        token
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No data received from server after update');
      }

      return response.data;
    } catch (error) {
      console.error('Failed to update property:', error);
      throw new Error('Failed to update property');
    }
  },

  addExpense: async (expenseData: Expense, cep: string): Promise<Expense> => {
    const token = await storage.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.post<Expense>(`/despesa/${cep}`, expenseData, token);
      
      if (response.error) {
        throw new Error(response.error);
      }

      return response.data as Expense;
    } catch (error) {
      console.error('Failed to add expense:', error);
      throw new Error('Failed to add expense');
    }
  },
  
  getExpenses:  async (): Promise<Expense[]> => {
    const user = await storage.getUser();
    const token = await storage.getToken();

    if (!user) {
      throw new Error('User not found');
    }
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const emailEncoded = encodeURIComponent(user.email);
      const response = await api.get(`/despesa/user/${emailEncoded}`, token);
  
      if (response.error) {
        throw new Error(response.error);
      }
  
      return response.data as Expense[];
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  },
  
  getPropertyExpenses: async (cep: string): Promise<Expense[]> => {
    const token = await storage.getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get(`/despesa/${cep}`, token);
  
      if (response.error) {
        throw new Error(response.error);
      }
  
      return response.data as Expense[];
    } catch (error) {
      console.error('Failed to fetch expenses by CEP:', error);
      throw new Error('Failed to fetch expenses by CEP');
    }
  },
};