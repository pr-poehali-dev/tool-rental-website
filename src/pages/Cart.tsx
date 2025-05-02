
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, X, Calendar, CreditCard, Truck, Calculator, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Пример данных корзины
// В реальном приложении эти данные будут храниться в контексте или Redux
const CART_ITEMS = [
  {
    id: 1,
    name: "Бензопила STIHL MS 180",
    image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    pricePerDay: 500,
    pricePerWeek: 3000,
    pricePerMonth: 10000,
    rentalPeriod: "day",
    quantity: 1,
    startDate: "2025-05-10",
    endDate: "2025-05-11",
    deposit: 5000
  },
  {
    id: 3,
    name: "Газонокосилка Husqvarna LC 247",
    image: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    pricePerDay: 700,
    pricePerWeek: 4200,
    pricePerMonth: 15000,
    rentalPeriod: "week",
    quantity: 1,
    startDate: "2025-05-15",
    endDate: "2025-05-22",
    deposit: 7000
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("self"); // "self" или "delivery"
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Расчет количества дней аренды
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Функция для получения цены в зависимости от периода аренды
  const getPriceByPeriod = (item: typeof CART_ITEMS[0]) => {
    switch (item.rentalPeriod) {
      case "day": return item.pricePerDay;
      case "week": return item.pricePerWeek;
      case "month": return item.pricePerMonth;
      default: return item.pricePerDay;
    }
  };
  
  // Функция для изменения количества товара
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Функция для удаления товара из корзины
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Расчет итоговой суммы
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (getPriceByPeriod(item) * item.quantity);
    }, 0);
  };
  
  // Расчет общей суммы залога
  const calculateDeposit = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.deposit * item.quantity);
    }, 0);
  };
  
  // Стоимость доставки
  const deliveryCost = deliveryOption === "delivery" ? 500 : 0;
  
  // Общая сумма заказа
  const orderTotal = calculateSubtotal() + deliveryCost;
  
  // Обработчик оформления заказа
  const handleCheckout = () => {
    if (!agreedToTerms) {
      alert("Пожалуйста, согласитесь с условиями аренды");
      return;
    }
    
    // Здесь будет логика оформления заказа
    // Переход на страницу оформления заказа или оплаты
    alert("Заказ успешно оформлен!");
    
    // Очистка корзины
    setCartItems([]);
    
    // Перенаправление на главную страницу
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <div className="flex items-center text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-orange-600">
              Главная
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium">Корзина</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Корзина</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Левая колонка - список товаров */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Товары в корзине</h2>
                  </div>
                  
                  {/* Список товаров */}
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Изображение товара */}
                          <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Информация о товаре */}
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <Link 
                                to={`/product/${item.id}`}
                                className="text-lg font-medium hover:text-orange-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                            
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {formatDate(item.startDate)} — {formatDate(item.endDate)}
                                {" "}
                                ({calculateDays(item.startDate, item.endDate)} {
                                  calculateDays(item.startDate, item.endDate) === 1 ? "день" :
                                  calculateDays(item.startDate, item.endDate) < 5 ? "дня" : "дней"
                                })
                              </span>
                            </div>
                            
                            <div className="sm:flex items-center justify-between mt-4">
                              <div className="mb-3 sm:mb-0">
                                <div className="text-gray-600 text-sm mb-1">
                                  {item.rentalPeriod === "day" ? "Суточная аренда" : 
                                   item.rentalPeriod === "week" ? "Недельная аренда" : "Месячная аренда"}
                                </div>
                                <div className="font-semibold">
                                  {getPriceByPeriod(item)} ₽{" "}
                                  <span className="text-sm font-normal text-gray-500">
                                    /{item.rentalPeriod === "day" ? "день" : 
                                      item.rentalPeriod === "week" ? "неделя" : "месяц"}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-3">Кол-во:</span>
                                <div className="flex items-center">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </Button>
                                  <div className="w-10 text-center">{item.quantity}</div>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50 border-t">
                    <Link to="/catalog" className="text-orange-600 hover:text-orange-700 font-medium">
                      Продолжить выбор инструментов
                    </Link>
                  </div>
                </div>
                
                {/* Способ получения */}
                <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Способ получения</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="delivery-self" 
                          checked={deliveryOption === "self"}
                          onCheckedChange={() => setDeliveryOption("self")}
                        />
                        <div>
                          <label 
                            htmlFor="delivery-self" 
                            className="font-medium cursor-pointer"
                          >
                            Самовывоз
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            г. Москва, ул. Инструментальная, д. 123
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          id="delivery-courier" 
                          checked={deliveryOption === "delivery"}
                          onCheckedChange={() => setDeliveryOption("delivery")}
                        />
                        <div>
                          <label 
                            htmlFor="delivery-courier" 
                            className="font-medium cursor-pointer"
                          >
                            Доставка курьером
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Доставка по городу — 500 ₽
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {deliveryOption === "delivery" && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-3">Адрес доставки</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder="Улица" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Дом" />
                            <Input placeholder="Квартира" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Input placeholder="Комментарий к доставке" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Правая колонка - оформление заказа */}
              <div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Ваш заказ</h2>
                  </div>
                  
                  <div className="p-6">
                    {/* Промокод */}
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-2 block">
                        Промокод
                      </label>
                      <div className="flex">
                        <Input 
                          placeholder="Введите промокод" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button 
                          variant="secondary" 
                          className="rounded-l-none"
                          disabled={!promoCode}
                        >
                          Применить
                        </Button>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Информация о заказе */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Товары ({cartItems.length})</span>
                        <span>{calculateSubtotal()} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Доставка</span>
                        <span>
                          {deliveryOption === "delivery" ? `${deliveryCost} ₽` : "Бесплатно"}
                        </span>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between text-base font-semibold">
                        <span>Итого</span>
                        <span>{orderTotal} ₽</span>
                      </div>
                      
                      <div className="flex justify-between text-orange-600">
                        <span>Залог (возвращается)</span>
                        <span>{calculateDeposit()} ₽</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg text-sm flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p>
                        Залог возвращается в полном объеме при возврате инструмента в исправном состоянии.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="mt-6">
                      <AccordionItem value="payment-info">
                        <AccordionTrigger className="text-sm font-medium">
                          Информация об оплате
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Принимаем наличные и банковские карты</span>
                            </div>
                            <div className="flex items-center">
                              <Calculator className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Безналичный расчет для юридических лиц</span>
                            </div>
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Оплата при получении или заранее</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                        />
                        <label 
                          htmlFor="terms" 
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          Я согласен с {" "}
                          <Link to="/terms" className="text-orange-600 hover:underline">
                            правилами аренды
                          </Link>
                          {" "} и подтверждаю, что ознакомлен с условиями возврата залога.
                        </label>
                      </div>
                      
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={!agreedToTerms}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
              <p className="text-gray-600 mb-6">
                В вашей корзине пока нет товаров. Перейдите в каталог, чтобы выбрать инструменты для аренды.
              </p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link to="/catalog">Перейти в каталог</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
