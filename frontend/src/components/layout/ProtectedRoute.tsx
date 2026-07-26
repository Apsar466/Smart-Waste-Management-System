import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'USER' | 'ADMIN'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the original path when redirecting to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Check if role has ROLE_ prefix (Spring Boot format)
    const normalizedRole = user.role.startsWith('ROLE_') ? user.role.substring(5) : user.role;
    const normalizedAllowedRoles = allowedRoles.map(r => r.startsWith('ROLE_') ? r.substring(5) : r);
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      // Role not authorized, redirect to homepage
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
