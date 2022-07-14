import { useContext } from 'react';
import { Auth, AuthContext } from '../context/auth-context';

const useAuth = () => {
  const auth = useContext<Auth | null>(AuthContext);

  return auth;
};

export default useAuth;
