import React, { createContext, useContext, useState } from 'react';
import { UserProfile, Handover, UserRolePerspective } from '../types';
import { mockHandovers } from '../data/mockData';
import { AuthService, RegisterPayload } from '../services/authService';

export type { UserRolePerspective };

export interface AuthUser extends UserProfile {
  id: string;
  perspective: UserRolePerspective;
  activeProjectName: string;
  activeHandoverId?: string;
}

interface AuthContextType {
  currentUser: AuthUser;
  login: (email: string, password?: string) => Promise<{ success: boolean; redirectPath: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; requiresEmailVerification: boolean; redirectPath: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  acceptInvitation: (token: string, password: string) => Promise<string>;
  activeHandover?: Handover;
  returnUrl?: string;
  setReturnUrl: (url?: string) => void;
}

const defaultManager: AuthUser = {
  id: 'usr-1',
  name: 'Sarah Lin',
  email: 'sarah.lin@knowflow.io',
  role: 'Project Manager',
  organization: 'Acme Technologies Inc.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  timezone: 'UTC+05:30 (IST)',
  notificationsEnabled: true,
  aiSensitivity: 'balanced',
  perspective: 'manager',
  activeProjectName: 'Core Payments & Ledger Migration',
  activeHandoverId: 'ho-01',
};

const defaultDeparting: AuthUser = {
  id: 'usr-2',
  name: 'Rutika Ghanwat',
  email: 'rutika.g@knowflow.io',
  role: 'Backend Developer',
  organization: 'Acme Technologies Inc.',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  timezone: 'UTC+05:30 (IST)',
  notificationsEnabled: true,
  aiSensitivity: 'balanced',
  perspective: 'departing',
  activeProjectName: 'Core Payments & Ledger Migration',
  activeHandoverId: 'ho-01',
};

const defaultIncoming: AuthUser = {
  id: 'usr-3',
  name: 'Marcus Vance',
  email: 'marcus.vance@knowflow.io',
  role: 'Backend Developer',
  organization: 'Acme Technologies Inc.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  timezone: 'UTC+05:30 (IST)',
  notificationsEnabled: true,
  aiSensitivity: 'balanced',
  perspective: 'incoming',
  activeProjectName: 'Core Payments & Ledger Migration',
  activeHandoverId: 'ho-01',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem('knowflow_user_id');
    if (saved === 'usr-2') return defaultDeparting;
    if (saved === 'usr-3') return defaultIncoming;
    return defaultManager;
  });

  const [returnUrl, setReturnUrl] = useState<string | undefined>(undefined);

  const getRedirectPathForUser = (user: AuthUser): string => {
    if (returnUrl) {
      const dest = returnUrl;
      setReturnUrl(undefined);
      return dest;
    }
    if (user.perspective === 'manager') {
      return '/app/overview';
    }
    return '/employee/overview';
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; redirectPath: string }> => {
    const result = await AuthService.login(email, password);
    const mappedUser: AuthUser = {
      ...result.user,
      timezone: 'UTC+05:30 (IST)',
      notificationsEnabled: true,
      aiSensitivity: 'balanced',
    };
    setCurrentUser(mappedUser);
    localStorage.setItem('knowflow_user_id', mappedUser.id);
    return { success: true, redirectPath: getRedirectPathForUser(mappedUser) };
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; requiresEmailVerification: boolean; redirectPath: string }> => {
    const result = await AuthService.register(payload);
    const mappedUser: AuthUser = {
      ...result.user,
      timezone: 'UTC+05:30 (IST)',
      notificationsEnabled: true,
      aiSensitivity: 'balanced',
    };
    setCurrentUser(mappedUser);
    localStorage.setItem('knowflow_user_id', mappedUser.id);
    return {
      success: true,
      requiresEmailVerification: result.requiresEmailVerification,
      redirectPath: '/app/overview',
    };
  };

  const logout = () => {
    localStorage.removeItem('knowflow_user_id');
    setCurrentUser(defaultManager);
  };

  const switchUser = (userId: string) => {
    if (userId === 'usr-2') {
      setCurrentUser(defaultDeparting);
      localStorage.setItem('knowflow_user_id', 'usr-2');
    } else if (userId === 'usr-3') {
      setCurrentUser(defaultIncoming);
      localStorage.setItem('knowflow_user_id', 'usr-3');
    } else {
      setCurrentUser(defaultManager);
      localStorage.setItem('knowflow_user_id', 'usr-1');
    }
  };

  const acceptInvitation = async (token: string, password: string): Promise<string> => {
    const res = await AuthService.acceptInvitation(token, password);
    const mappedUser: AuthUser = {
      ...res.user,
      timezone: 'UTC+05:30 (IST)',
      notificationsEnabled: true,
      aiSensitivity: 'balanced',
    };
    setCurrentUser(mappedUser);
    localStorage.setItem('knowflow_user_id', mappedUser.id);
    return '/employee/overview';
  };

  const activeHandover = mockHandovers.find(h => h.id === currentUser.activeHandoverId) || mockHandovers[0];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        switchUser,
        acceptInvitation,
        activeHandover,
        returnUrl,
        setReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
