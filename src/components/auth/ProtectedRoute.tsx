import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router";

/** Wajib login; redirect state disimpan agar bisa kembali setelah login. */
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <FullScreenLoader />;
  }

  if (status === "anonymous") {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
