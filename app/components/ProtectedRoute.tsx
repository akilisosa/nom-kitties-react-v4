'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const user = await getCurrentUser();
      // User is authenticated
      setLoading(false);
    } catch (error) {
      // User is not authenticated
      router.push('/auth');
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <>{children}</>;
};

export default ProtectedRoute;
