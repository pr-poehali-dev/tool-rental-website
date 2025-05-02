
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  FileText, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  MessageSquare
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon, label, isCollapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center p-2 rounded-md w-full transition-colors
        ${isActive 
          ? 'bg-orange-100 text-orange-700' 
          : 'text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-current">{icon}</div>
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </div>
    </NavLink>
  );
};

type AdminSidebarProps = {
  onLogout: () => void;
};

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-white border-r h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed && (
          <div className="text-lg font-bold">
            ПрокатТул<span className="text-orange-600">Админ</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 pt-2">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarLink 
              to="/admin/dashboard" 
              icon={<Home className="h-5 w-5" />} 
              label="Дашборд" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/orders" 
              icon={<ShoppingCart className="h-5 w-5" />} 
              label="Заказы" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/products" 
              icon={<Package className="h-5 w-5" />} 
              label="Инструменты" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/users" 
              icon={<Users className="h-5 w-5" />} 
              label="Пользователи" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/statistics" 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Статистика" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/messages" 
              icon={<MessageSquare className="h-5 w-5" />} 
              label="Сообщения" 
              isCollapsed={isCollapsed} 
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <SidebarLink 
              to="/admin/settings" 
              icon={<Settings className="h-5 w-5" />} 
              label="Настройки" 
              isCollapsed={isCollapsed} 
            />
            <SidebarLink 
              to="/admin/docs" 
              icon={<FileText className="h-5 w-5" />} 
              label="Документация" 
              isCollapsed={isCollapsed} 
            />
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-3">
        <Button 
          variant="ghost" 
          className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
            isCollapsed ? 'px-2' : ''
          }`}
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Выйти</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
