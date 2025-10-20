import React, { createContext, useCallback, useEffect, useState } from 'react';
import api from '../utils/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/get-user/${id}`);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error('UserContext: fetchUser failed', err);
      setError(err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience method to re-fetch the current user (reads id from localStorage)
  const refresh = useCallback(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    if (!id) return Promise.resolve(null);
    return fetchUser(id);
  }, [fetchUser]);

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    if (id) {
      // fire-and-forget; fetchUser updates state
      fetchUser(id);
    }
    // Intentionally only run on mount; fetchUser is stable via useCallback
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error, fetchUser, refresh }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
