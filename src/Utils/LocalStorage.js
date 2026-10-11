import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue; // corrupted data or storage blocked
    }
  });
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setSaveError("");
    } catch {
      setSaveError("Browser storage is full, so the latest changes won't survive a refresh.");
    }
  }, [key, value]);

  return [value, setValue, saveError];
}