
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, ChevronRight, CreditCard, Info, MapPin, Trash, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { bookingService, CreateBookingRequest } from "@/services/booking.service";

// Временная заглушка для корзины
// В реальном приложении данные будут храниться в контексте или Redux
const CART_ITEMS = [
  {
    id: 1,
    productId: 1,
    name: "Бензопила STIHL MS 180",
    image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    pricePerDay: 500,
    quantity: 1,
    deposit: 5000
  },
  {
    id: 2,
    productId: 2,
    name: "Триммер STIHL FS 55",
    image: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    pricePerDay: 400,
    quantity: 1,
    deposit: 4000
  }
];

const Booking = () => {
  const navigate = useNavigate();
  // Состояние корзины
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  
  // Состояние формы бронирования
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    notes: "",
    agreedToTerms: false,
    useDelivery: false
  });
  
  // Состояние календаря
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)) // По умолчанию +3 дня
  });
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Обработчик изменения чекбоксов
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };
  
  // Удаление товара из корзины
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Расчет количества дней аренды
  const calculateDays = () => {
    if (!dateRange.from || !dateRange.to) return 1;
    
    const diff = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // +1 день, так как включаем и день начала
  };
  
  // Расчет стоимости аренды
  const calculateRentalCost = () => {
    const days = calculateDays();
    return cartItems.reduce((total, item) => {
      return total + (item.pricePerDay * item.quantity * days);
    }, 0);
  };
  
  // Расчет суммы залога
  const calculateDeposit = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.deposit * item.quantity);
    }, 0);
  };
  
  // Расчет стоимости доставки
  const calculateDeliveryCost = () => {
    return formData.useDelivery ? 500 : 0;
  };
  
  // Расчет общей суммы
  const calculateTotal = () => {
    return calculateRentalCost() + calculateDeliveryCost();
  };
  
  // Форматирование даты
  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ru });
  };
  
  // Обработчик отправки формы бронирования
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с правилами аренды",
        variant: "destructive",
      });
      return;
    }
    
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Ошибка",
        description: "Необходимо выбрать даты аренды",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Подготавливаем данные для API
      const bookingData: CreateBookingRequest = {
        userName: formData.name,
        userPhone: formData.phone,
        userEmail: formData.email,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        notes: formData.notes,
        deliveryAddress: formData.useDelivery ? formData.deliveryAddress : undefined,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      
      // Отправляем запрос на создание бронирования
      const response = await bookingService.createBooking(bookingData);
      
      // Очищаем корзину
      setCartItems([]);
      
      // Показываем уведомление об успехе
      toast({
        title: "Бронирование создано",
        description: `Ваш заказ #${response.id} успешно оформлен. Мы свяжемся с вами в ближайшее время.`,
      });
      
      // Перенаправляем на страницу успешного бронирования
      navigate(`/booking-success/${response.id}`);
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать бронирование. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Хлебные крошки */}
          <div className="flex items-center text-sm mb-6">
            <a href="/" className="text-gray-500 hover:text-orange-600">
              Главная
            </a>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <a href="/cart" className="text-gray-500 hover:text-orange-600">
              Корзина
            </a>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium">Оформление бронирования</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Оформление бронирования</h1>
          
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Форма оформления бронирования */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Блок с выбором дат */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-orange-600" />
                          Даты аренды
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Дата начала</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    {dateRange.from ? (
                                      formatDate(dateRange.from)
                                    ) : (
                                      <span>Выберите дату начала</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={(range) => {
                                      if (range?.from) {
                                        setDateRange(range);
                                      }
                                    }}
                                    disabled={(date) => 
                                      date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Дата окончания</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    {dateRange.to ? (
                                      formatDate(dateRange.to)
                                    ) : (
                                      <span>Выберите дату окончания</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={(range) => {
                                      if (range?.from) {
                                        setDateRange(range);
                                      }
                                    }}
                                    disabled={(date) => 
                                      date < new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-md text-sm flex items-start">
                            <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-blue-800">
                                Срок аренды: <strong>{calculateDays()} {
                                  calculateDays() === 1 ? "день" : 
                                  calculateDays() < 5 ? "дня" : "дней"
                                }</strong>
                              </p>
                              <p className="text-blue-700 mt-1">
                                Оборудование необходимо вернуть до 18:00 дня окончания аренды.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Блок с контактной информацией */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <User className="h-5 w-5 mr-2 text-orange-600" />
                          Контактная информация
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">ФИО</Label>
                              <Input 
                                id="name" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Иванов Иван Иванович" 
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Телефон</Label>
                              <Input 
                                id="phone" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+7 (999) 123-45-67" 
                                required 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="example@mail.ru" 
                              required 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Блок с доставкой */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                          Способ получения
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="delivery-self" 
                              checked={!formData.useDelivery}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange("useDelivery", !checked)
                              }
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
                              checked={formData.useDelivery}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange("useDelivery", !!checked)
                              }
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
                          
                          {formData.useDelivery && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="deliveryAddress">Адрес доставки</Label>
                              <Textarea 
                                id="deliveryAddress" 
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                placeholder="Укажите полный адрес доставки"
                                required={formData.useDelivery}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Блок с примечаниями */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Дополнительная информация</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="notes">Примечания к заказу</Label>
                            <Textarea 
                              id="notes" 
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Напишите здесь любую дополнительную информацию" 
                            />
                          </div>
                          
                          <div className="flex items-start space-x-2 pt-4">
                            <Checkbox 
                              id="terms" 
                              checked={formData.agreedToTerms}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange("agreedToTerms", !!checked)
                              }
                              required
                            />
                            <label 
                              htmlFor="terms" 
                              className="text-sm text-gray-600"
                            >
                              Я согласен с правилами аренды и подтверждаю, что ознакомлен с условиями возврата залога.
                            </label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                
                  {/* Кнопки */}
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" type="button" onClick={() => navigate('/cart')}>
                      Вернуться в корзину
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={!formData.agreedToTerms || cartItems.length === 0}
                    >
                      Оформить бронирование
                    </Button>
                  </div>
                </form>
              </div>
              
              {/* Правая колонка - сводка заказа */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Ваш заказ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Список товаров */}
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                              <div className="text-sm">
                                {item.pricePerDay} ₽/день × {item.quantity} шт.
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {/* Даты аренды */}
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Период аренды:</span>
                          <span>
                            {dateRange.from && dateRange.to ? (
                              <>
                                {formatDate(dateRange.from)} — {formatDate(dateRange.to)}
                              </>
                            ) : (
                              "Не выбрано"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Количество дней:</span>
                          <span>{calculateDays()} {
                            calculateDays() === 1 ? "день" : 
                            calculateDays() < 5 ? "дня" : "дней"
                          }</span>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Стоимость */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Стоимость аренды:</span>
                          <span>{calculateRentalCost()} ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Доставка:</span>
                          <span>
                            {formData.useDelivery ? `${calculateDeliveryCost()} ₽` : "Бесплатно"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between pt-2 text-base font-semibold">
                          <span>Итого:</span>
                          <span>{calculateTotal()} ₽</span>
                        </div>
                        
                        <div className="flex justify-between text-orange-600">
                          <span>Залог (возвращается):</span>
                          <span>{calculateDeposit()} ₽</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-md text-sm flex items-start mt-4">
                        <CreditCard className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-gray-700">
                          Оплата производится при получении инструмента наличными или банковской картой.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
              <p className="text-gray-600 mb-6">
                В вашей корзине пока нет товаров. Перейдите в каталог, чтобы выбрать инструменты для аренды.
              </p>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <a href="/catalog">Перейти в каталог</a>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
