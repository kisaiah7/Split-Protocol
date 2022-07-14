import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import useAuth from '../hooks/use-auth';

type Props = {
  children: ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const auth = useAuth();
  const router = useRouter();

  if (!auth) throw new Error('Missing authentication provider');

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      auth.setPreviousLocation(router.pathname);
      router.replace('/');
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return <div className="h-screen bg-body-gradient" />;
  }

  return <>{children}</>;
};

export default RequireAuth;
