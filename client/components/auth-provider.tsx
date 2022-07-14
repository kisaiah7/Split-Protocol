import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { AuthContext, Auth } from '../context/auth-context';

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const previousLocationRef = useRef<string | null>(null);
  const router = useRouter();

  const { isConnected } = useAccount();

  const setPreviousLocation = (previousLocation: string) => {
    previousLocationRef.current = previousLocation;
  };

  // Necessary to prevent hydration errors
  useEffect(() => setIsLoading(false), []);
  useEffect(() => {
    setIsAuthenticated(isConnected);
    if (isConnected && previousLocationRef.current) {
      router.replace(previousLocationRef.current);
      previousLocationRef.current = null;
    }
  }, [isConnected]);

  const value: Auth = {
    isLoading,
    isAuthenticated,
    setPreviousLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
