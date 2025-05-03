
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  CreditCard,
  Phone, 
  ArrowRight,
  Printer,
  AlertCircle,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bookingService, Booking } from "@/services/booking.service";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const BookingSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;
        
        const bookingId = parseInt(id);
        const bookingData = await bookingService.getBooking(bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error('Ошибка при загрузке бронирования:', error);
        setError('Не удалось загрузить информацию о бронировании');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: ru });
  };

  // Печать страницы
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-10 pb-8 px-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Ошибка загрузки бронирования</h1>
                <p className="text-gray-600 mb-6">
                  {error || "Не удалось найти информацию о бронировании. Проверьте правильность ссылки."}
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link to="/">Вернуться на главную</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/catalog">Перейти в каталог</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto print:shadow-none">
            <CardContent className="pt-10 pb-8 px-8">
              <div className="text-center mb-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Бронирование успешно оформлено!</h1>
                <p className="text-gray-600">
                  Ваше бронирование #{booking.id} успешно создано и ожидает подтверждения
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                    Информация о бронировании
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Номер бронирования</div>
                      <div className="font-medium">#{booking.id}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 mb-1">Даты аренды</div>
                      <div>
                        <div className="font-medium">
                          {formatDate(booking.startDate)} — {formatDate(booking.endDate)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Необходимо вернуть до 18:00 последнего дня аренды
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 mb-1">Статус</div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                                    font-medium bg-yellow-100 text-yellow-800">
                        Ожидает подтверждения
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <ClipboardList className="h-5 w-5 text-orange-600 mr-2" />
                    Контактная информация
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">ФИО</div>
                      <div className="font-medium">{booking.userName}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 mb-1">Контакты</div>
                      <div className="font-medium">{booking.userPhone}</div>
                      <div className="font-medium">{booking.userEmail}</div>
                    </div>
                    
                    <div>
                      <div className="text-gray-500 mb-1">Способ получения</div>
                      <div className="font-medium flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>
                          {booking.deliveryAddress 
                            ? `Доставка: ${booking.deliveryAddress}`
                            : "Самовывоз: г. Москва, ул. Инструментальная, д. 123"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-semibold text-lg mb-4">Арендуемые инструменты</h3>
              
              <div className="space-y-4 mb-6">
                {booking.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.productName}</h4>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">
                          {item.pricePerDay} ₽/день × {item.quantity} шт. × {item.totalDays} {
                            item.totalDays === 1 ? "день" : 
                            item.totalDays < 5 ? "дня" : "дней"
                          }
                        </span>
                        <span className="font-medium">{item.totalPrice} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Стоимость аренды</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {booking.deliveryPrice ? `Доставка (${booking.deliveryPrice} ₽)` : "Доставка"}
                    </div>
                    <div className="font-medium mt-2">Итого</div>
                    <div className="text-orange-600 mt-1">Залог (возвращается)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{booking.totalAmount - (booking.deliveryPrice || 0)} ₽</div>
                    <div className="text-sm mt-1">{booking.deliveryPrice ? `${booking.deliveryPrice} ₽` : "Бесплатно"}</div>
                    <div className="font-medium mt-2">{booking.totalAmount} ₽</div>
                    <div className="font-medium text-orange-600 mt-1">{booking.depositAmount} ₽</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg mt-6 flex items-start">
                <CreditCard className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-800 font-medium">Оплата и получение</p>
                  <p className="text-orange-700 text-sm mt-1">
                    Оплата производится при получении инструмента. После подтверждения бронирования 
                    с вами свяжется наш менеджер для уточнения деталей.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mt-6 flex items-start">
                <Phone className="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 font-medium">Есть вопросы?</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Позвоните нам по телефону <span className="font-medium">+7 (999) 123-45-67</span> или напишите на почту <span className="font-medium">info@prokattul.ru</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between mt-10 print:hidden">
                <Button asChild variant="outline" onClick={handlePrint}>
                  <div className="flex items-center">
                    <Printer className="mr-2 h-4 w-4" />
                    Распечатать
                  </div>
                </Button>
                
                <div className="space-x-4">
                  <Button asChild variant="outline">
                    <Link to="/catalog">
                      Вернуться в каталог
                    </Link>
                  </Button>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link to="/">
                      На главную страницу
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingSuccess;
