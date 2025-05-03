
import { useState, useEffect, useRef } from "react";
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
  ClipboardList,
  Share2,
  Download,
  QrCode,
  Clock,
  Bookmark,
  CornerDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { bookingService, Booking } from "@/services/booking.service";
import { format, differenceInDays, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";

// Функция для генерации QR-кода (заглушка, в реальном проекте можно использовать библиотеку)
const generateQRCodeURL = (bookingId: number) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://prokattul.ru/booking/${bookingId}`;
};

const BookingSuccess = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const bookingSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!id) return;
        
        const bookingId = parseInt(id);
        const bookingData = await bookingService.getBooking(bookingId);
        setBooking(bookingData);
        
        // Определяем статус бронирования
        setCurrentStatus(bookingData.status || "pending");
        
        // Устанавливаем обратный отсчет до начала аренды
        if (bookingData.startDate) {
          const daysLeft = differenceInDays(new Date(bookingData.startDate), new Date());
          if (daysLeft > 0) {
            setCountdown(daysLeft);
          }
        }
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

  // Копирование номера бронирования в буфер обмена
  const copyBookingNumber = () => {
    if (booking) {
      navigator.clipboard.writeText(`#${booking.id}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "Скопировано!",
        description: `Номер бронирования #${booking.id} скопирован в буфер обмена.`,
      });
    }
  };

  // Скачивание подтверждения бронирования (заглушка)
  const downloadConfirmation = () => {
    toast({
      title: "Загрузка началась",
      description: "Подтверждение бронирования скачивается...",
    });
  };

  // Поделиться бронированием (заглушка)
  const shareBooking = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: `Бронирование #${booking.id} в ProkatTul`,
        text: `Я арендовал инструменты в ProkatTul. Мой номер бронирования: #${booking.id}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      toast({
        title: "Поделиться",
        description: "Ссылка на бронирование скопирована в буфер обмена.",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Отображение соответствующего статуса
  const renderStatus = () => {
    switch (currentStatus) {
      case "confirmed":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                        font-medium bg-green-100 text-green-800">
            Подтверждено
          </div>
        );
      case "completed":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                        font-medium bg-blue-100 text-blue-800">
            Завершено
          </div>
        );
      case "cancelled":
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                        font-medium bg-red-100 text-red-800">
            Отменено
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs 
                        font-medium bg-yellow-100 text-yellow-800">
            Ожидает подтверждения
          </div>
        );
    }
  };

  // Отображение прогресса бронирования
  const renderProgressBar = () => {
    let progressValue = 0;
    let progressLabel = "";

    switch (currentStatus) {
      case "pending":
        progressValue = 25;
        progressLabel = "Ожидает подтверждения";
        break;
      case "confirmed":
        progressValue = 50;
        progressLabel = "Подтверждено";
        break;
      case "active":
        progressValue = 75;
        progressLabel = "В аренде";
        break;
      case "completed":
        progressValue = 100;
        progressLabel = "Завершено";
        break;
      case "cancelled":
        progressValue = 100;
        progressLabel = "Отменено";
        break;
    }

    return (
      <div className="my-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <div>Создано</div>
          <div>Подтверждено</div>
          <div>В аренде</div>
          <div>Завершено</div>
        </div>
        <Progress value={progressValue} className="h-2" />
        <div className="text-center text-sm mt-2 font-medium text-gray-700">{progressLabel}</div>
      </div>
    );
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
            <CardContent className="pt-10 pb-8 px-8" ref={bookingSummaryRef}>
              <div className="print:hidden flex justify-end mb-2">
                <div className="space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handlePrint}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Распечатать</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={downloadConfirmation}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Скачать PDF</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={shareBooking}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Поделиться</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Бронирование успешно оформлено!</h1>
                <p className="text-gray-600">
                  Ваше бронирование{" "}
                  <button 
                    onClick={copyBookingNumber}
                    className="font-medium cursor-pointer text-orange-600 hover:underline focus:outline-none"
                  >
                    #{booking.id} {copySuccess && <span className="text-green-500">(скопировано)</span>}
                  </button>{" "}
                  успешно создано
                </p>
              </div>
              
              {/* Прогресс бронирования */}
              <div className="print:hidden">
                {renderProgressBar()}
              </div>
              
              {/* Отображение обратного отсчета до начала аренды */}
              {countdown && currentStatus !== "cancelled" && (
                <div className="bg-blue-50 p-4 rounded-lg mt-2 mb-6 flex items-start print:hidden">
                  <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-medium">До начала аренды осталось: {countdown} {countdown === 1 ? 'день' : countdown < 5 ? 'дня' : 'дней'}</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Ваша аренда начинается {formatDate(booking.startDate)}. Не забудьте взять с собой документы!
                    </p>
                  </div>
                </div>
              )}
              
              <Tabs defaultValue="details" className="print:hidden">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Детали</TabsTrigger>
                  <TabsTrigger value="qrcode">QR-код</TabsTrigger>
                  <TabsTrigger value="instructions">Инструкции</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-6">
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
                          {renderStatus()}
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
                </TabsContent>
                
                <TabsContent value="qrcode" className="pt-4">
                  <div className="flex flex-col items-center py-4">
                    <div className="border border-gray-200 p-4 rounded-lg mb-4">
                      <img 
                        src={generateQRCodeURL(booking.id)} 
                        alt="QR код бронирования" 
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-center text-gray-600 max-w-md">
                      Предъявите этот QR-код при получении инструментов. 
                      Он содержит всю информацию о вашем бронировании.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={downloadConfirmation}>
                      <Download className="h-4 w-4 mr-2" />
                      Скачать QR-код
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="pt-4">
                  <div className="space-y-4 py-4">
                    <h3 className="font-semibold mb-3">Инструкция по получению инструментов</h3>
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">1</div>
                        <p className="text-gray-700">
                          Возьмите с собой паспорт и залог {booking.depositAmount} ₽ (наличными или банковской картой)
                        </p>
                      </div>
                      <div className="flex">
                        <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">2</div>
                        <p className="text-gray-700">
                          {booking.deliveryAddress 
                            ? `Ожидайте доставку по адресу: ${booking.deliveryAddress} в выбранное время`
                            : "Приходите по адресу: г. Москва, ул. Инструментальная, д. 123 в рабочее время (9:00-19:00)"
                          }
                        </p>
                      </div>
                      <div className="flex">
                        <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">3</div>
                        <p className="text-gray-700">
                          Проверьте исправность инструмента вместе с сотрудником пункта проката
                        </p>
                      </div>
                      <div className="flex">
                        <div className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">4</div>
                        <p className="text-gray-700">
                          Подпишите договор аренды и произведите оплату
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Инструкция по возврату инструментов</h3>
                      <div className="space-y-4">
                        <div className="flex">
                          <div className="bg-gray-100 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">1</div>
                          <p className="text-gray-700">
                            Верните инструмент в том же состоянии, в котором вы его получили
                          </p>
                        </div>
                        <div className="flex">
                          <div className="bg-gray-100 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">2</div>
                          <p className="text-gray-700">
                            Возврат должен быть произведен не позднее {formatDate(booking.endDate)} до 18:00
                          </p>
                        </div>
                        <div className="flex">
                          <div className="bg-gray-100 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 flex-shrink-0">3</div>
                          <p className="text-gray-700">
                            После проверки сотрудником вам будет возвращен залог
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Separator className="my-6" />
              
              <h3 className="font-semibold text-lg mb-4">Арендуемые инструменты</h3>
              
              <div className="space-y-4 mb-6">
                {booking.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">
                        <Link to={`/product/${item.productId}`} className="hover:text-orange-600 transition-colors">
                          {item.productName}
                        </Link>
                      </h4>
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
              
              {/* Кнопки управления бронированием */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 print:hidden">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <QrCode className="h-4 w-4" />
                        Показать QR-код
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>QR-код вашего бронирования</DialogTitle>
                        <DialogDescription>
                          Предъявите этот код при получении инструментов.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center py-4">
                        <img 
                          src={generateQRCodeURL(booking.id)} 
                          alt="QR код бронирования" 
                          className="w-56 h-56 border p-2 rounded"
                        />
                      </div>
                      <div className="text-center font-medium">
                        Бронирование #{booking.id}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {currentStatus === "pending" && (
                    <Button variant="destructive" className="gap-2">
                      <CornerDownLeft className="h-4 w-4" />
                      Отменить
                    </Button>
                  )}
                </div>
                
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
