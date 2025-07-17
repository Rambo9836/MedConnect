import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('medconnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('medconnect_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call with password validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple password validation for demo
      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        userType: credentials.userType,
        firstName: credentials.email.split('@')[0],
        lastName: 'User',
        profileComplete: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        privacySettings: {
          shareWithResearchers: true,
          allowCommunityMessages: true,
          showInSearch: true,
          dataRetentionPeriod: 365
        }
      };

      setUser(mockUser);
      localStorage.setItem('medconnect_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Password validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        userType: data.userType,
        firstName: data.firstName,
        lastName: data.lastName,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        privacySettings: {
          shareWithResearchers: true,
          allowCommunityMessages: true,
          showInSearch: true,
          dataRetentionPeriod: 365
        },
        ...(data.userType === 'patient' && {
          patientProfile: {
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            conditions: data.cancerType ? [data.cancerType] : [],
            medications: [],
            allergies: []
          }
        }),
        ...(data.userType === 'researcher' && {
          researcherProfile: {
            title: data.title,
            institution: data.company,
            specialization: data.specialization,
            licenseNumber: data.licenseNumber,
            verificationStatus: 'pending'
          }
        })
      };

      setUser(mockUser);
      localStorage.setItem('medconnect_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('medconnect_user', JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medconnect_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};