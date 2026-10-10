import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { dataStore } from '../services/dataStore';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface SignupInput {
  name: string;
  email: string;
  username?: string;
  password?: string;
  specialization?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCoreMember: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  signup: (data: SignupInput) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('aiml_auth_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('aiml_auth_user');
      localStorage.removeItem('aiml_auth_user');
    }
  }, [user]);

  useEffect(() => {
    const syncActiveUser = () => {
      setUser((prevUser) => {
        if (!prevUser) return null;
        if (prevUser.id.startsWith('demo-')) return prevUser;
        const latest = dataStore.getProfiles().find((p) => p.id === prevUser.id);
        if (!latest) {
          return null;
        }
        if (latest.accountStatus === 'Deactivated') {
          return null;
        }
        return { ...latest };
      });
    };

    const unsubscribe = dataStore.subscribe(syncActiveUser);
    return () => unsubscribe();
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    dataStore.updateMember(user.id, updated, user.id);
  };

  const login = async (identifier: string, _password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, error: 'Please enter your username or email.' };
    }

    const matched = dataStore.findMemberByIdentifier(cleanId);

    if (matched) {
      const expectedPassword = matched.password || '123456';
      if (_password && _password !== expectedPassword) {
        return { success: false, error: 'Invalid password. (Default is 123456)' };
      }

      if (matched.accountStatus === 'Deactivated') {
        return {
          success: false,
          error: `Account "${matched.username || matched.email}" has been deactivated by an administrator.`,
        };
      }

      setUser(matched);
      return { success: true, user: matched };
    }

    if (cleanId.startsWith('#')) {
      return { 
        success: false, 
        error: `Member account "${cleanId}" not found. You can submit a Join Request in the Sign Up tab.` 
      };
    }

    if (isSupabaseConfigured && _password && cleanId.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanId, password: _password });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
          const authUser: UserProfile = prof || {
            id: data.user.id,
            email: data.user.email || cleanId,
            username: `#${cleanId.split('@')[0]}123`,
            name: cleanId.split('@')[0],
            role: 'Registered User',
            accountStatus: 'Active',
            created_at: new Date().toISOString()
          };
          setUser(authUser);
          return { success: true, user: authUser };
        }
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'Authentication failed' };
      }
    }

    return { 
      success: false, 
      error: `Account "${cleanId}" not found. Switch to the Sign Up tab to create an account.` 
    };
  };

  const signup = async (data: SignupInput): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim();
    if (!cleanName || !cleanEmail) {
      return { success: false, error: 'Please enter your full name and email address.' };
    }

    const existingByEmail = dataStore.findMemberByIdentifier(cleanEmail);
    if (existingByEmail) {
      return {
        success: false,
        error: `An account with email "${cleanEmail}" already exists. Please sign in instead.`,
      };
    }

    const result = dataStore.addMember({
      name: cleanName,
      email: cleanEmail,
      username: data.username?.trim() || undefined,
      password: data.password || '123456',
      role: 'Registered User',
      accountStatus: 'Active',
      specialization: data.specialization?.trim() || 'AI & Machine Learning',
    });

    if (!result.success || !result.member) {
      return {
        success: false,
        error: result.error || 'Could not create account. Please try a different username.',
      };
    }

    setUser(result.member);
    return { success: true, user: result.member };
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().then();
    }
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const profiles = dataStore.getProfiles();
    const match = profiles.find(
      p => p.role === targetRole && p.accountStatus !== 'Deactivated'
    );
    if (match) {
      setUser(match);
    } else {
      const demoUser: UserProfile = {
        id: 'demo-' + targetRole.toLowerCase().replace(/\s+/g, '-'),
        email: `${targetRole.toLowerCase().replace(/\s+/g, '')}@aimlclub.edu`,
        name: `${targetRole} Demo Account`,
        role: targetRole,
        accountStatus: 'Active',
        specialization: targetRole === 'Admin' ? 'GPU Infrastructure & Oversight' : 'Neural Networks',
        created_at: new Date().toISOString()
      };
      setUser(demoUser);
    }
  };

  const role: UserRole = user ? user.role : 'Member';
  const isAuthenticated = Boolean(user && user.accountStatus !== 'Deactivated');
  const isAdmin = Boolean(user && user.role === 'Admin' && user.accountStatus !== 'Deactivated');
  const isCoreMember = Boolean(
    user &&
      (user.role === 'Vice President' || user.role === 'Core Member' || isAdmin) &&
      user.accountStatus !== 'Deactivated'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isCoreMember,
        login,
        signup,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
