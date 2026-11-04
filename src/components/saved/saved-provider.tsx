"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SavedContextValue = {
  savedIds: string[];
  count: number;
  hydrated: boolean;
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);
const STORAGE_KEY = "haya-nest-saved-v1";

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setSavedIds(Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string") : []);
      } catch {
        setSavedIds([]);
      } finally {
        setHydrated(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [hydrated, savedIds]);

  const toggle = useCallback((productId: string) => {
    setSavedIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }, []);
  const remove = useCallback((productId: string) => setSavedIds((current) => current.filter((id) => id !== productId)), []);
  const clear = useCallback(() => setSavedIds([]), []);
  const isSaved = useCallback((productId: string) => savedIds.includes(productId), [savedIds]);
  const value = useMemo(() => ({ savedIds, count: savedIds.length, hydrated, isSaved, toggle, remove, clear }), [savedIds, hydrated, isSaved, toggle, remove, clear]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSaved must be used inside SavedProvider");
  return value;
}
