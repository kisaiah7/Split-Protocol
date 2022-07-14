import { createContext } from 'react';

export type Auth = {
  isLoading: boolean;
  isAuthenticated: boolean;
  setPreviousLocation: (previousLocation: string) => void;
};

export const AuthContext = createContext<Auth | null>(null);
