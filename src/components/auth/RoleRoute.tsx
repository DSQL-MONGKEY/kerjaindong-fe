import { homePathForRoles, useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/types";
import { Navigate, Outlet } from "react-router";

interface RoleRouteProps {
  allowed: Role[];
}

/** Batasi area berdasarkan role; role lain diarahkan ke beranda miliknya. */
export default function RoleRoute({ allowed }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const hasAccess = user.roles.some((role) => allowed.includes(role));

  if (!hasAccess) {
    return <Navigate to={homePathForRoles(user.roles)} replace />;
  }

  return <Outlet />;
}
