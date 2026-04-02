import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}