"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserData {
  user_id: string;
  fullname: string;
  phone_number: string;
  phone_number_verified: boolean;
  email: string | null;
  address: string | null;
  created_at: string | null;
  kyc_verified: boolean;
  avatar: string;
  kyc_session_url: string;
}

export interface StoreEntry {
  store_id: string;
  store_name: string;
  store_owner: string;
  created_at: string | null;
  store_address: string | null;
  store_main_phone_number: string;
  bot_share_link: string;
  zalo_bot_id: string;
  zalobot_activated?: boolean;
}

interface AuthContextValue {
  user: UserData | null;
  stores: StoreEntry[];
  activeStoreId: string | null;
  setActiveStoreId: (id: string) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue>({
  user: null,
  stores: [],
  activeStoreId: null,
  setActiveStoreId: () => { },
  isLoading: true,
  refresh: async () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [stores, setStores] = useState<StoreEntry[]>([]);
  const [activeStoreId, setActiveStoreIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const setActiveStoreId = (id: string) => {
    setActiveStoreIdState(id);
    localStorage.setItem("active_store_id", id);
  };

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Get the authenticated user first
      const userRes = await fetch(`${API_URL}/me/get`, {
        headers: { Authorization: token },
      });

      if (!userRes.ok) {
        setIsLoading(false);
        return;
      }

      const userData = await userRes.json();
      if (!userData.success) {
        setIsLoading(false);
        return;
      }

      const fetchedUser: UserData = userData.user;
      setUser(fetchedUser);

      // 2️⃣ Use the resolved user_id to fetch that user's stores
      const storesRes = await fetch(`${API_URL}/store/list`, {
        headers: { Authorization: token },
      });

      if (storesRes.ok) {
        const storesData = await storesRes.json();
        if (storesData.success) {
          setStores(storesData.stores);
          // Restore persisted active store, or default to first
          const persisted = localStorage.getItem("active_store_id");
          const validPersisted = storesData.stores.find(
            (s: StoreEntry) => s.store_id === persisted
          );
          if (validPersisted) {
            setActiveStoreIdState(validPersisted.store_id);
          } else if (storesData.stores.length > 0) {
            setActiveStoreIdState(storesData.stores[0].store_id);
            localStorage.setItem("active_store_id", storesData.stores[0].store_id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch auth data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ user, stores, activeStoreId, setActiveStoreId, isLoading, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
