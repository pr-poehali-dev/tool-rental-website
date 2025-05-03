
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  FileText,
  Check,
  X,
  Clock,
  AlertCircle,
  Eye
} from "lucide-react";
import { 
  Booking, 
  BookingStatus, 
  bookingService, 
  BookingFilters,
  UpdateBookingStatusRequest 
} from "@/services/booking.service";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

// Определяем статусы бронирования и их названия, цвета
const bookingStatusMap: Record<BookingStatus, { label: string, variant: string }> = {
  'pending': { label: 'Ожидает подтверждения', variant: 'warning' },
  'confirmed': { label: 'Подтверждено', variant: 'success' },
  'active': { label: 'Активно', variant: 'success' },
  'completed': { label: 'Завершено', variant: 'default' },
  'cancelled': { label: 'Отменено', variant: 'destructive' }
};

// Форматирование даты
const formatDate = (date: string) => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus | "">("");
  const [statusNotes, setStatusNotes] = useState("");

  // Загрузка бронирований с фильтрацией
  const loadBookings = async () => {
    setLoading(true);
    
    try {
      const filters: BookingFilters = {
        search: searchQuery,
        status: statusFilter !== "all" ? statusFilter as BookingStatus : undefined,
        page: currentPage,
        perPage: 10
      };
      
      const response = await bookingService.getBookings(filters);
      
      setBookings(response.data);
      setTotalPages(response.meta.last_page);
      setTotalItems(response.meta.total);
    } catch (error) {
      console.error('Ошибка при загрузке бронирований:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список бронирований",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании и изменении фильтров
  useEffect(() => {
    loadBookings();
  }, [currentPage, statusFilter]);

  // Обработчик поиска
  const handleSearch = () => {
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
    loadBookings();
  };

  // Обработчик просмотра бронирования
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  // Обработчик изменения статуса
  const handleOpenStatusDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNotes("");
    setIsStatusDialogOpen(true);
  };

  // Сохранение нового статуса
  const handleSaveStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    
    try {
      const data: UpdateBookingStatusRequest = {
        status: newStatus as BookingStatus,
        notes: statusNotes
      };
      
      await bookingService.updateBookingStatus(selectedBooking.id, data);
      
      toast({
        title: "Статус обновлен",
        description: `Бронирование #${selectedBooking.id} теперь имеет статус "${bookingStatusMap[newStatus as BookingStatus].label}"`,
      });
      
      // Обновляем список бронирований
      loadBookings();
      
      // Закрываем диалог
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус бронирования",
        variant: "destructive",
      });
    }
  };

  // Обработчик отмены бронирования
  const handleCancelBooking = async (id: number, reason: string = "") => {
    try {
      await bookingService.cancelBooking(id, reason);
      
      toast({
        title: "Бронирование отменено",
        description: `Бронирование #${id} было отменено`,
      });
      
      // Обновляем список бронирований
      loadBookings();
      
      // Закрываем диалог
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Ошибка при отмене бронирования:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить бронирование",
        variant: "destructive",
      });
    }
  };

  // Получаем компонент Badge с правильным цветом для статуса
  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = bookingStatusMap[status];
    
    let className = "";
    
    switch (statusConfig.variant) {
      case 'success':
        className = "bg-green-100 text-green-800 hover:bg-green-200";
        break;
      case 'warning':
        className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        break;
      case 'destructive':
        className = "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      default:
        className = "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
    
    return (
      <Badge className={className}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление бронированиями</h1>
        <p className="text-gray-500">Просмотр и управление бронированиями инструментов</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Бронирования</CardTitle>
          <CardDescription>
            Список всех бронирований инструментов клиентами.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Фильтры и поиск */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Поиск по имени, email или телефону..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSearch}>
                Найти
              </Button>
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Статус" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                    <SelectItem value="confirmed">Подтверждено</SelectItem>
                    <SelectItem value="active">Активно</SelectItem>
                    <SelectItem value="completed">Завершено</SelectItem>
                    <SelectItem value="cancelled">Отменено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Таблица бронирований */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID / Клиент</TableHead>
                  <TableHead>Детали</TableHead>
                  <TableHead>Даты</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full mr-2"></div>
                        Загрузка бронирований...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">#{booking.id}</div>
                        <div className="text-sm text-gray-500">{booking.userName}</div>
                        <div className="text-xs text-gray-400">{booking.userEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {booking.items.length} {
                            booking.items.length === 1 ? "позиция" : 
                            booking.items.length < 5 ? "позиции" : "позиций"
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {booking.items.map(item => item.productName).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(booking.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(booking.endDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{booking.totalAmount} ₽</div>
                        <div className="text-xs text-gray-500">
                          {booking.paymentStatus === 'paid' ? 'Оплачено' : 
                           booking.paymentStatus === 'refunded' ? 'Возвращено' : 'Не оплачено'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Просмотр
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenStatusDialog(booking)}>
                              <Clock className="h-4 w-4 mr-2" />
                              Изменить статус
                            </DropdownMenuItem>
                            {booking.status !== 'cancelled' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Отменить
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Не найдено бронирований, соответствующих критериям поиска
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано {bookings.length} из {totalItems} бронирований
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Страница {currentPage} из {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Диалог просмотра бронирования */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Просмотр бронирования #{selectedBooking?.id}</DialogTitle>
            <DialogDescription>
              Подробная информация о бронировании
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Клиент</h3>
                  <p className="font-medium">{selectedBooking.userName}</p>
                  <p className="text-sm">{selectedBooking.userEmail}</p>
                  <p className="text-sm">{selectedBooking.userPhone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Даты аренды</h3>
                  <p className="text-sm">Начало: {formatDate(selectedBooking.startDate)}</p>
                  <p className="text-sm">Окончание: {formatDate(selectedBooking.endDate)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Арендуемые инструменты</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Кол-во</TableHead>
                      <TableHead>Цена/день</TableHead>
                      <TableHead>Дней</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBooking.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.productName}</div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.pricePerDay} ₽</TableCell>
                        <TableCell>{item.totalDays}</TableCell>
                        <TableCell className="text-right font-medium">{item.totalPrice} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Статус</h3>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedBooking.status)}
                    <span className="text-sm">
                      Оплата: {selectedBooking.paymentStatus === 'paid' ? 'Оплачено' : 
                              selectedBooking.paymentStatus === 'refunded' ? 'Возвращено' : 'Не оплачено'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Финансы</h3>
                  <p className="text-sm">Сумма аренды: <span className="font-medium">{selectedBooking.totalAmount} ₽</span></p>
                  <p className="text-sm">Залог: <span className="font-medium">{selectedBooking.depositAmount} ₽</span></p>
                  {selectedBooking.deliveryPrice && (
                    <p className="text-sm">Доставка: <span className="font-medium">{selectedBooking.deliveryPrice} ₽</span></p>
                  )}
                </div>
              </div>
              
              {selectedBooking.deliveryAddress && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Адрес доставки</h3>
                  <p className="text-sm">{selectedBooking.deliveryAddress}</p>
                </div>
              )}
              
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Примечания</h3>
                  <p className="text-sm p-3 bg-gray-50 rounded">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                <p>Создано: {formatDate(selectedBooking.createdAt)}</p>
                <p>Обновлено: {formatDate(selectedBooking.updatedAt)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Закрыть
            </Button>
            {selectedBooking && selectedBooking.status !== 'cancelled' && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleCancelBooking(selectedBooking.id);
                }}
              >
                Отменить бронирование
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог изменения статуса */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Изменить статус бронирования</DialogTitle>
            <DialogDescription>
              Обновите статус бронирования #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус бронирования</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Примечания к изменению статуса</Label>
              <Textarea 
                id="notes" 
                placeholder="Например: Инструмент выдан клиенту" 
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
            
            {newStatus === 'cancelled' && (
              <div className="p-3 rounded-md bg-red-50 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  При отмене бронирования клиенту будет автоматически возвращен залог (если он был внесен).
                
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleSaveStatus}
              disabled={!newStatus}
              className={newStatus === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : undefined}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
