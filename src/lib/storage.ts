export const safeGetItem = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
export const safeSetItem = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* private browsing */ }
};
export const safeRemoveItem = (key: string): void => {
  try { localStorage.removeItem(key); } catch { /* private browsing */ }
};
