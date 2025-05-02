
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли токен администратора в localStorage
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      // Если токена нет, перенаправляем на страницу входа
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Удаляем данные аутентификации из localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    
    // Перенаправляем на страницу входа
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Будет перенаправлено в useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onLogout={handleLogout} />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
