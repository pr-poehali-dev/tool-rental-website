
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ПрокатТул</h3>
            <p className="mb-4">
              Профессиональный прокат бензоинструмента для любых задач. Работаем с частными лицами и организациями.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                <Instagram />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-white">
                <Facebook />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">Главная</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-orange-500 transition-colors">Каталог</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-500 transition-colors">О нас</Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-orange-500 transition-colors">Контакты</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-500 transition-colors">Личный кабинет</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Категории</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog?category=saws" className="hover:text-orange-500 transition-colors">Пилы</Link>
              </li>
              <li>
                <Link to="/catalog?category=trimmers" className="hover:text-orange-500 transition-colors">Триммеры</Link>
              </li>
              <li>
                <Link to="/catalog?category=lawnmowers" className="hover:text-orange-500 transition-colors">Газонокосилки</Link>
              </li>
              <li>
                <Link to="/catalog?category=generators" className="hover:text-orange-500 transition-colors">Генераторы</Link>
              </li>
              <li>
                <Link to="/catalog?category=washers" className="hover:text-orange-500 transition-colors">Мойки</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5" />
                <a href="mailto:info@prokattul.ru" className="hover:text-orange-500">
                  info@prokattul.ru
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span>г. Москва, ул. Инструментальная, д. 123</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5" />
                <span>Пн-Пт: 9:00-19:00, Сб: 10:00-17:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          <p>© 2025 ПрокатТул. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
