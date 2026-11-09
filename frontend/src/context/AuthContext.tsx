import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, TeamMember, Handover } from '../types';
import { mockTeamMembers, mockHandovers } from '../data/mockData';

export type UserRolePerspective = 'manager' | 'departing' | 'incoming' | 'member';

interface AuthUser extends UserProfile {
  id: string;
  perspective: UserRolePerspective;
  activeProjectName: string;
  activeHandoverId?: string;
}

interface AuthContextType {
  currentUser: AuthUser;
  login: (email: string, password?: string) => { success: boolean; redirectPath: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  acceptInvitation: (token: string, password: string, name?: string) => string;
  activeHandover?: Handover;
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
  email: 'rutika.ghanwat@knowflow.io',
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

  const getRedirectPathForUser = (user: AuthUser): string => {
    if (user.perspective === 'departing') {
      return '/app/my-handover';
    }
    if (user.perspective === 'incoming') {
      return '/app/my-report';
    }
    return '/app/overview';
  };

  const login = (email: string): { success: boolean; redirectPath: string } => {
    const normalized = email.trim().toLowerCase();
    let targetUser: AuthUser;

    if (normalized.includes('rutika') || normalized.includes('departing')) {
      targetUser = defaultDeparting;
    } else if (normalized.includes('marcus') || normalized.includes('incoming')) {
      targetUser = defaultIncoming;
    } else {
      targetUser = defaultManager;
    }

    setCurrentUser(targetUser);
    localStorage.setItem('knowflow_user_id', targetUser.id);
    return { success: true, redirectPath: getRedirectPathForUser(targetUser) };
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

  const acceptInvitation = (token: string, password: string, name?: string): string => {
    // Simulated token: 'inv-rutika' -> departing, 'inv-marcus' -> incoming
    if (token.includes('marcus')) {
      setCurrentUser(defaultIncoming);
      localStorage.setItem('knowflow_user_id', 'usr-3');
      return '/app/my-report';
    }
    setCurrentUser(defaultDeparting);
    localStorage.setItem('knowflow_user_id', 'usr-2');
    return '/app/my-handover';
  };

  const activeHandover = mockHandovers.find(h => h.id === currentUser.activeHandoverId) || mockHandovers[0];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchUser,
        acceptInvitation,
        activeHandover,
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
