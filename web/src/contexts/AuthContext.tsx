import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isVerified: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isVerified: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isVerified = user?.emailVerified || false;

  return (
    <AuthContext.Provider value={{ user, isVerified, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
