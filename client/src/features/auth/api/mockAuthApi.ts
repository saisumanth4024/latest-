import { LoginCredentials, LoginResponse, RegisterCredentials, User } from '../types';

// A set of mock users for testing
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 0, 1).toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Regular+User&background=4CAF50&color=fff',
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date(2023, 1, 15).toISOString()
  },
  {
    id: '3',
    email: 'seller@example.com',
    firstName: 'Seller',
    lastName: 'User',
    role: 'seller',
    profileImageUrl: 'https://ui-avatars.com/api/?name=Seller+User&background=FF9800&color=fff',
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString()
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock login API function
 * 
 * @param credentials User login credentials
 * @returns A promise with login response data
 */
export const mockLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Simulate network delay
  await delay(1000);
  
  // Find user by email
  const user = mockUsers.find(u => u.email === credentials.email);
  
  // Simulate authentication
  if (user && credentials.password === 'password123') {
    // Generate a mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return {
      user,
      token
    };
  }
  
  // Simulate authentication failure
  throw new Error('Invalid email or password');
};

/**
 * Mock register API function
 * 
 * @param registerData User registration data
 * @returns A promise with login response data for the new user
 */
export const mockRegister = async (registerData: RegisterCredentials): Promise<LoginResponse> => {
  // Simulate network delay
  await delay(1000);
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === registerData.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create a new user
  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    email: registerData.email,
    firstName: registerData.firstName || '',
    lastName: registerData.lastName || '',
    role: 'user', // Default role for new users
    profileImageUrl: `https://ui-avatars.com/api/?name=${registerData.firstName}+${registerData.lastName}&background=E91E63&color=fff`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to mock users (in a real app, this would be a database insert)
  mockUsers.push(newUser);
  
  // Generate a mock JWT token
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  
  return {
    user: newUser,
    token
  };
};

/**
 * Validate a token (mock implementation)
 * 
 * @param token The JWT token to validate
 * @returns The user associated with the token if valid
 */
export const validateToken = async (token: string): Promise<User | null> => {
  // Simulate network delay
  await delay(500);
  
  // Check if token is in the expected format
  if (token && token.startsWith('mock-jwt-token-')) {
    // Extract user ID from token
    const parts = token.split('-');
    const userId = parts[2];
    
    // Find user by ID
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
  }
  
  return null;
};