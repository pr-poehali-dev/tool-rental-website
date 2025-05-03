
import { apiRequest, buildQueryParams, PaginatedResponse } from "@/lib/api";

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  depositAmount: number;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  items: BookingItem[];
  notes?: string;
  deliveryAddress?: string;
  deliveryPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  pricePerDay: number;
  totalDays: number;
  totalPrice: number;
}

export interface BookingFilters {
  search?: string;
  status?: BookingStatus | 'all';
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBookingRequest {
  userId?: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  notes?: string;
  deliveryAddress?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  notes?: string;
}

class BookingService {
  // Получение списка бронирований с фильтрацией и пагинацией
  async getBookings(filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
    // В реальном приложении здесь будет запрос к API
    const queryParams = buildQueryParams({
      search: filters.search,
      status: filters.status !== 'all' ? filters.status : undefined,
      start_date: filters.startDate,
      end_date: filters.endDate,
      page: filters.page || 1,
      per_page: filters.perPage || 10,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    });

    // Имитация запроса к API для демонстрации
    // В реальном проекте используйте:
    // return apiRequest<PaginatedResponse<Booking>>(`/bookings${queryParams}`);

    // Демо-данные
    const mockBookings: Booking[] = [
      {
        id: 12345,
        userId: 101,
        userName: "Иванов Иван",
        userPhone: "+7 (999) 123-45-67",
        userEmail: "ivanov@example.com",
        startDate: "2025-05-10T10:00:00Z",
        endDate: "2025-05-12T18:00:00Z",
        totalAmount: 2500,
        depositAmount: 5000,
        status: "confirmed",
        paymentStatus: "paid",
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Бензопила STIHL MS 180",
            productImage: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 500,
            totalDays: 3,
            totalPrice: 1500
          },
          {
            id: 2,
            productId: 2,
            productName: "Триммер STIHL FS 55",
            productImage: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 400,
            totalDays: 2,
            totalPrice: 800
          }
        ],
        notes: "Клиент заберет самостоятельно",
        createdAt: "2025-05-01T15:23:00Z",
        updatedAt: "2025-05-01T15:30:00Z"
      },
      {
        id: 12346,
        userId: 102,
        userName: "Петров Сергей",
        userPhone: "+7 (999) 987-65-43",
        userEmail: "petrov@example.com",
        startDate: "2025-05-15T09:00:00Z",
        endDate: "2025-05-22T18:00:00Z",
        totalAmount: 4200,
        depositAmount: 7000,
        status: "pending",
        paymentStatus: "pending",
        items: [
          {
            id: 3,
            productId: 3,
            productName: "Газонокосилка Husqvarna LC 247",
            productImage: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 700,
            totalDays: 6,
            totalPrice: 4200
          }
        ],
        deliveryAddress: "г. Москва, ул. Примерная, д. 123, кв. 45",
        deliveryPrice: 500,
        createdAt: "2025-05-02T10:15:00Z",
        updatedAt: "2025-05-02T10:15:00Z"
      },
      {
        id: 12347,
        userId: 103,
        userName: "Сидорова Анна",
        userPhone: "+7 (999) 555-44-33",
        userEmail: "sidorova@example.com",
        startDate: "2025-04-20T12:00:00Z",
        endDate: "2025-04-22T18:00:00Z",
        totalAmount: 1800,
        depositAmount: 6000,
        status: "completed",
        paymentStatus: "paid",
        items: [
          {
            id: 4,
            productId: 6,
            productName: "Минимойка Karcher K5",
            productImage: "https://images.unsplash.com/photo-1621978407950-f015b1431377?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 600,
            totalDays: 3,
            totalPrice: 1800
          }
        ],
        notes: "Клиент вернул оборудование в полном порядке",
        createdAt: "2025-04-15T09:30:00Z",
        updatedAt: "2025-04-22T19:15:00Z"
      }
    ];

    // Фильтрация
    let filtered = [...mockBookings];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.userName.toLowerCase().includes(search) || 
        b.userEmail.toLowerCase().includes(search) ||
        b.userPhone.includes(search) ||
        String(b.id).includes(search)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(b => 
        new Date(b.startDate) >= new Date(filters.startDate as string)
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(b => 
        new Date(b.endDate) <= new Date(filters.endDate as string)
      );
    }

    // Сортировка
    if (filters.sortBy) {
      filtered.sort((a: any, b: any) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return a[filters.sortBy] > b[filters.sortBy] ? order : -order;
      });
    } else {
      // По умолчанию сортируем по ID в обратном порядке (новые сверху)
      filtered.sort((a, b) => b.id - a.id);
    }

    // Пагинация
    const page = filters.page || 1;
    const perPage = filters.perPage || 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      meta: {
        current_page: page,
        from: start + 1,
        last_page: Math.ceil(filtered.length / perPage),
        per_page: perPage,
        to: Math.min(end, filtered.length),
        total: filtered.length
      },
      links: {
        first: "/api/bookings?page=1",
        last: `/api/bookings?page=${Math.ceil(filtered.length / perPage)}`,
        next: page < Math.ceil(filtered.length / perPage) ? `/api/bookings?page=${page + 1}` : null,
        prev: page > 1 ? `/api/bookings?page=${page - 1}` : null
      }
    };
  }

  // Получение одного бронирования по ID
  async getBooking(id: number): Promise<Booking> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Booking>(`/bookings/${id}`);
    
    // Демо данные
    const bookings = [
      {
        id: 12345,
        userId: 101,
        userName: "Иванов Иван",
        userPhone: "+7 (999) 123-45-67",
        userEmail: "ivanov@example.com",
        startDate: "2025-05-10T10:00:00Z",
        endDate: "2025-05-12T18:00:00Z",
        totalAmount: 2500,
        depositAmount: 5000,
        status: "confirmed",
        paymentStatus: "paid",
        items: [
          {
            id: 1,
            productId: 1,
            productName: "Бензопила STIHL MS 180",
            productImage: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 500,
            totalDays: 3,
            totalPrice: 1500
          },
          {
            id: 2,
            productId: 2,
            productName: "Триммер STIHL FS 55",
            productImage: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            quantity: 1,
            pricePerDay: 400,
            totalDays: 2,
            totalPrice: 800
          }
        ],
        notes: "Клиент заберет самостоятельно",
        createdAt: "2025-05-01T15:23:00Z",
        updatedAt: "2025-05-01T15:30:00Z"
      }
    ];
    
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error(`Бронирование с ID ${id} не найдено`);
    }
    
    return booking as Booking;
  }

  // Создание нового бронирования
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Booking>('/bookings', 'POST', bookingData);
    
    // Для демонстрации возвращаем объект с данными нового бронирования
    return {
      id: Math.floor(Math.random() * 1000) + 10000, // Генерируем случайный ID
      userId: bookingData.userId || 0,
      userName: bookingData.userName,
      userPhone: bookingData.userPhone,
      userEmail: bookingData.userEmail,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalAmount: 3500, // В реальном API это рассчитывается на бэкенде
      depositAmount: 6000, // В реальном API это рассчитывается на бэкенде
      status: "pending",
      paymentStatus: "pending",
      items: bookingData.items.map((item, index) => ({
        id: index + 1,
        productId: item.productId,
        productName: `Продукт ${item.productId}`, // В реальном API это берется из БД
        productImage: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80", // В реальном API это берется из БД
        quantity: item.quantity,
        pricePerDay: 500, // В реальном API это берется из БД
        totalDays: 3, // В реальном API это рассчитывается на бэкенде
        totalPrice: 1500 // В реальном API это рассчитывается на бэкенде
      })),
      notes: bookingData.notes,
      deliveryAddress: bookingData.deliveryAddress,
      deliveryPrice: bookingData.deliveryAddress ? 500 : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Booking;
  }

  // Обновление статуса бронирования
  async updateBookingStatus(id: number, data: UpdateBookingStatusRequest): Promise<Booking> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Booking>(`/bookings/${id}/status`, 'PATCH', data);
    
    // Для демонстрации возвращаем обновленный объект
    return {
      id,
      userId: 101,
      userName: "Иванов Иван",
      userPhone: "+7 (999) 123-45-67",
      userEmail: "ivanov@example.com",
      startDate: "2025-05-10T10:00:00Z",
      endDate: "2025-05-12T18:00:00Z",
      totalAmount: 2500,
      depositAmount: 5000,
      status: data.status,
      paymentStatus: data.status === 'completed' ? 'paid' : 'pending',
      items: [
        {
          id: 1,
          productId: 1,
          productName: "Бензопила STIHL MS 180",
          productImage: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
          quantity: 1,
          pricePerDay: 500,
          totalDays: 3,
          totalPrice: 1500
        }
      ],
      notes: data.notes,
      createdAt: "2025-05-01T15:23:00Z",
      updatedAt: new Date().toISOString()
    } as Booking;
  }

  // Отмена бронирования
  async cancelBooking(id: number, reason?: string): Promise<Booking> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Booking>(`/bookings/${id}/cancel`, 'POST', { reason });
    
    // Для демонстрации возвращаем обновленный объект
    return {
      id,
      userId: 101,
      userName: "Иванов Иван",
      userPhone: "+7 (999) 123-45-67",
      userEmail: "ivanov@example.com",
      startDate: "2025-05-10T10:00:00Z",
      endDate: "2025-05-12T18:00:00Z",
      totalAmount: 2500,
      depositAmount: 5000,
      status: "cancelled",
      paymentStatus: "refunded",
      items: [
        {
          id: 1,
          productId: 1,
          productName: "Бензопила STIHL MS 180",
          productImage: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
          quantity: 1,
          pricePerDay: 500,
          totalDays: 3,
          totalPrice: 1500
        }
      ],
      notes: reason ? `Отменено: ${reason}` : "Отменено",
      createdAt: "2025-05-01T15:23:00Z",
      updatedAt: new Date().toISOString()
    } as Booking;
  }
}

export const bookingService = new BookingService();
