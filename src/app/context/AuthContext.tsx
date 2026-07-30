import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  fetchProfile,
  saveProfile,
  fetchReports,
  pushReport,
  syncReports,
} from '../../../utils/supabase/cabadaApi';

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface UserProfile {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  emergencyContacts: EmergencyContact[];
  registeredAt: string;
}

export interface EmergencyReport {
  id: string;
  category: string;
  subcategory: string;
  status: 'active' | 'completed' | 'cancelled';
  date: string;
  time: string;
  location: string;
  responseTime: string;
  unit: string;
}

// ── localStorage helpers (offline cache) ────────────────────────────────────

const STORAGE_KEY = 'cabada_users';
const SESSION_KEY = 'cabada_session';

interface LocalUserData {
  profile: UserProfile;
  history: EmergencyReport[];
}

function loadLocal(): Record<string, LocalUserData> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveLocal(users: Record<string, LocalUserData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function emptyProfile(phone: string): UserProfile {
  return {
    phone, firstName: '', lastName: '', email: '',
    street: '', neighborhood: '', city: 'Cabada', state: 'Nuevo León',
    bloodType: '', allergies: '', medicalConditions: '',
    emergencyContacts: [], registeredAt: new Date().toISOString(),
  };
}

// ── Context ──────────────────────────────────────────────────────────────────

interface AuthContextType {
  currentPhone: string | null;
  profile: UserProfile | null;
  history: EmergencyReport[];
  syncing: boolean;
  login: (phone: string) => Promise<void>;
  loginWithProfile: (profile: UserProfile) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  addReport: (report: Omit<EmergencyReport, 'id'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentPhone, setCurrentPhone] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const phone = localStorage.getItem(SESSION_KEY);
    return phone ? (loadLocal()[phone]?.profile ?? null) : null;
  });
  const [history, setHistory] = useState<EmergencyReport[]>(() => {
    const phone = localStorage.getItem(SESSION_KEY);
    return phone ? (loadLocal()[phone]?.history ?? []) : [];
  });
  const [syncing, setSyncing] = useState(false);

  // Sync from cloud whenever we have a logged-in user
  useEffect(() => {
    if (!currentPhone) return;
    setSyncing(true);
    Promise.all([
      fetchProfile(currentPhone).catch(() => null),
      fetchReports(currentPhone).catch(() => null),
    ]).then(([cloudProfile, cloudHistory]) => {
      const users = loadLocal();
      if (!users[currentPhone]) {
        users[currentPhone] = { profile: emptyProfile(currentPhone), history: [] };
      }
      if (cloudProfile) {
        users[currentPhone].profile = cloudProfile;
        setProfile(cloudProfile);
      }
      if (cloudHistory) {
        users[currentPhone].history = cloudHistory;
        setHistory(cloudHistory);
      }
      saveLocal(users);
    }).finally(() => setSyncing(false));
  }, [currentPhone]);

  const login = useCallback(async (phone: string) => {
    localStorage.setItem(SESSION_KEY, phone);
    const users = loadLocal();
    if (!users[phone]) {
      users[phone] = { profile: emptyProfile(phone), history: [] };
      saveLocal(users);
    }
    setProfile(users[phone].profile);
    setHistory(users[phone].history);
    setCurrentPhone(phone);
  }, []);

  const loginWithProfile = useCallback(async (newProfile: UserProfile) => {
    const phone = newProfile.phone;
    const profileWithDate = { ...newProfile, registeredAt: new Date().toISOString() };

    // Save locally first (instant)
    const users = loadLocal();
    users[phone] = { profile: profileWithDate, history: users[phone]?.history ?? [] };
    saveLocal(users);
    localStorage.setItem(SESSION_KEY, phone);
    setProfile(profileWithDate);
    setHistory(users[phone].history);
    setCurrentPhone(phone);

    // Sync to cloud in background
    saveProfile(profileWithDate).catch(console.error);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!currentPhone) return;
    const users = loadLocal();
    if (!users[currentPhone]) {
      users[currentPhone] = { profile: emptyProfile(currentPhone), history: [] };
    }
    const updated = { ...users[currentPhone].profile, ...updates };
    users[currentPhone].profile = updated;
    saveLocal(users);
    setProfile(updated);

    // Sync to cloud
    saveProfile(updated).catch(console.error);
  }, [currentPhone]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentPhone(null);
    setProfile(null);
    setHistory([]);
  }, []);

  const addReport = useCallback(async (report: Omit<EmergencyReport, 'id'>) => {
    if (!currentPhone) return;
    const newReport: EmergencyReport = { ...report, id: `#RPT-${Date.now()}` };

    // Update locally first
    const users = loadLocal();
    if (!users[currentPhone]) {
      users[currentPhone] = { profile: emptyProfile(currentPhone), history: [] };
    }
    users[currentPhone].history.unshift(newReport);
    saveLocal(users);
    setHistory([...users[currentPhone].history]);

    // Sync to cloud
    pushReport(currentPhone, newReport).catch(console.error);
  }, [currentPhone]);

  return (
    <AuthContext.Provider value={{
      currentPhone, profile, history, syncing,
      login, loginWithProfile, updateProfile, logout, addReport,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
