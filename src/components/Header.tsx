
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-b.svg" alt="Логотип" className="h-10" />
          <span className="font-bold text-xl text-gray-900">ПрокатТул</span>
        </Link>
        
        {/* Десктопное меню */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">Главная</Link>
          <Link to="/catalog" className="text-gray-700 hover:text-orange-600 font-medium">Каталог</Link>
          <Link to="/about" className="text-gray-700 hover:text-orange-600 font-medium">О нас</Link>
          <Link to="/contacts" className="text-gray-700 hover:text-orange-600 font-medium">Контакты</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium">Войти</Link>
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
        </div>
        
        {/* Мобильное меню */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="mr-4">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Мобильное меню выпадающее */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            <Link to="/" className="py-2 text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
              Главная
            </Link>
            <Link to="/catalog" className="py-2 text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
              Каталог
            </Link>
            <Link to="/about" className="py-2 text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
              О нас
            </Link>
            <Link to="/contacts" className="py-2 text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
              Контакты
            </Link>
            <Link to="/login" className="py-2 text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
              Войти
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
