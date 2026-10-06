let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

/**
 * Access token disimpan in-memory (bukan localStorage) untuk mengurangi
 * risiko XSS. Refresh token ada di cookie httpOnly milik backend.
 */
export const tokenStore = {
  get: (): string | null => accessToken,
  set(token: string | null) {
    accessToken = token;
    listeners.forEach((listener) => listener(token));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
