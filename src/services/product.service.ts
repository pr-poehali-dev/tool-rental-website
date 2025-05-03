
import { apiRequest, buildQueryParams, PaginatedResponse } from "@/lib/api";

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  totalUnits: number;
  availableUnits: number;
  image: string;
  status: 'active' | 'inactive';
  description?: string;
  specifications?: Array<{name: string, value: string}>;
  features?: string[];
  deposit?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  status?: 'active' | 'inactive' | 'all';
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductRequest {
  name: string;
  category: string;
  brand: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  totalUnits: number;
  image?: string;
  description?: string;
  specifications?: Array<{name: string, value: string}>;
  features?: string[];
  deposit?: number;
  status?: 'active' | 'inactive';
}

class ProductService {
  // Получение списка продуктов с фильтрацией и пагинацией
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    // В реальном приложении здесь будет запрос к API
    const queryParams = buildQueryParams({
      search: filters.search,
      category: filters.category,
      brand: filters.brand,
      status: filters.status !== 'all' ? filters.status : undefined,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      page: filters.page || 1,
      per_page: filters.perPage || 10,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder
    });

    // Имитация запроса к API для демонстрации
    // В реальном проекте используйте:
    // return apiRequest<PaginatedResponse<Product>>(`/products${queryParams}`);

    // Демо-данные
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Бензопила STIHL MS 180",
        category: "Пилы",
        brand: "STIHL",
        pricePerDay: 500,
        pricePerWeek: 3000,
        pricePerMonth: 10000,
        totalUnits: 3,
        availableUnits: 1,
        image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        deposit: 5000,
        createdAt: "2025-01-15T10:00:00Z",
        updatedAt: "2025-04-27T15:30:00Z"
      },
      {
        id: 2,
        name: "Триммер STIHL FS 55",
        category: "Триммеры",
        brand: "STIHL",
        pricePerDay: 400,
        pricePerWeek: 2400,
        pricePerMonth: 8000,
        totalUnits: 5,
        availableUnits: 2,
        image: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        deposit: 4000,
        createdAt: "2025-02-10T09:15:00Z",
        updatedAt: "2025-04-25T11:45:00Z"
      },
      {
        id: 3,
        name: "Газонокосилка Husqvarna LC 247",
        category: "Газонокосилки",
        brand: "Husqvarna",
        pricePerDay: 700,
        pricePerWeek: 4200,
        pricePerMonth: 15000,
        totalUnits: 2,
        availableUnits: 0,
        image: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        deposit: 7000,
        createdAt: "2025-03-05T14:20:00Z",
        updatedAt: "2025-04-28T16:10:00Z"
      }
    ];

    // Фильтрация
    let filtered = [...mockProducts];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.brand.toLowerCase().includes(search)
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Сортировка
    if (filters.sortBy) {
      filtered.sort((a: any, b: any) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return a[filters.sortBy] > b[filters.sortBy] ? order : -order;
      });
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
        first: "/api/products?page=1",
        last: `/api/products?page=${Math.ceil(filtered.length / perPage)}`,
        next: page < Math.ceil(filtered.length / perPage) ? `/api/products?page=${page + 1}` : null,
        prev: page > 1 ? `/api/products?page=${page - 1}` : null
      }
    };
  }

  // Получение одного продукта по ID
  async getProduct(id: number): Promise<Product> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Product>(`/products/${id}`);
    
    // Демо данные
    const products = [
      {
        id: 1,
        name: "Бензопила STIHL MS 180",
        category: "Пилы",
        brand: "STIHL",
        pricePerDay: 500,
        pricePerWeek: 3000,
        pricePerMonth: 10000,
        totalUnits: 3,
        availableUnits: 1,
        image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        status: "active",
        description: "Бензопила STIHL MS 180 предназначена для периодических работ по уходу за садовым участком, заготовке дров и строительства из дерева. Оснащена 2-MIX двигателем с пониженным расходом топлива и низким уровнем выбросов вредных веществ.",
        specifications: [
          { name: "Мощность", value: "1.5 кВт / 2.0 л.с." },
          { name: "Вес", value: "4.1 кг" },
          { name: "Длина шины", value: "35 см" },
          { name: "Объем двигателя", value: "31.8 см³" },
          { name: "Шаг цепи", value: "3/8\" P" },
          { name: "Уровень шума", value: "112 дБ(A)" },
          { name: "Топливный бак", value: "0.25 л" },
          { name: "Гарантия", value: "1 год" }
        ],
        features: [
          "Антивибрационная система",
          "Система быстрого натяжения цепи",
          "Система фильтрации воздуха с предварительной очисткой",
          "Боковое натяжение цепи",
          "Одна комбинированная рукоятка управления"
        ],
        deposit: 5000,
      },
    ];
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
      throw new Error(`Продукт с ID ${id} не найден`);
    }
    
    return product as Product;
  }

  // Создание нового продукта
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Product>('/products', 'POST', productData);
    
    // Для демонстрации возвращаем объект с данными нового продукта
    return {
      id: Math.floor(Math.random() * 1000) + 10, // Генерируем случайный ID
      ...productData,
      totalUnits: Number(productData.totalUnits),
      availableUnits: Number(productData.totalUnits),
      pricePerDay: Number(productData.pricePerDay),
      pricePerWeek: productData.pricePerWeek ? Number(productData.pricePerWeek) : undefined,
      pricePerMonth: productData.pricePerMonth ? Number(productData.pricePerMonth) : undefined,
      deposit: productData.deposit ? Number(productData.deposit) : undefined,
      status: productData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product;
  }

  // Обновление продукта
  async updateProduct(id: number, productData: Partial<CreateProductRequest>): Promise<Product> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Product>(`/products/${id}`, 'PUT', productData);
    
    // Для демонстрации возвращаем обновленный объект
    return {
      id,
      name: productData.name || "Обновленный продукт",
      category: productData.category || "Категория",
      brand: productData.brand || "Бренд",
      pricePerDay: productData.pricePerDay ? Number(productData.pricePerDay) : 0,
      totalUnits: productData.totalUnits ? Number(productData.totalUnits) : 0,
      availableUnits: productData.totalUnits ? Number(productData.totalUnits) : 0,
      image: productData.image || "https://example.com/image.jpg",
      status: productData.status || 'active',
      updatedAt: new Date().toISOString()
    } as Product;
  }

  // Удаление продукта
  async deleteProduct(id: number): Promise<void> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<void>(`/products/${id}`, 'DELETE');
    
    // Для демонстрации просто возвращаем Promise
    console.log(`Продукт с ID ${id} удален`);
    return Promise.resolve();
  }

  // Изменение статуса продукта
  async updateProductStatus(id: number, status: 'active' | 'inactive'): Promise<Product> {
    // В реальном приложении здесь будет запрос к API
    // return apiRequest<Product>(`/products/${id}/status`, 'PATCH', { status });
    
    // Для демонстрации возвращаем обновленный объект
    return {
      id,
      name: "Продукт",
      category: "Категория",
      brand: "Бренд",
      pricePerDay: 0,
      totalUnits: 0,
      availableUnits: 0,
      image: "https://example.com/image.jpg",
      status,
      updatedAt: new Date().toISOString()
    } as Product;
  }
}

export const productService = new ProductService();
