import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface User {
  id: number;
  username: string;
}

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const [status, setStatus] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://api.lazydev.uz/api/v1/auth/status",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw await response.json();
        }

        const result: User = await response.json();
        setStatus(result);
      } catch (error: any) {
        if (error?.statusCode === 401) {
          localStorage.removeItem("accessToken");
        }
        setStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return status ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
