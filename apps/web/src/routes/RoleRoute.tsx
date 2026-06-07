import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../types/auth";
import { useAuth } from "../hooks/useAuth";

export function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
