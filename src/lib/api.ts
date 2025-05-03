
import { toast } from "@/components/ui/use-toast";

// Базовые настройки API
const API_URL = 'https://api.prokattul-demo.ru/api/v1'; // Для демонстрации

// Типы объектов для работы с API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

// Базовый класс для запросов к API
export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('adminToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    ...options,
  };
  
  if (data && (method !== 'GET')) {
    config.body = JSON.stringify(data);
  }
  
  try {
    // Для демонстрации используем эмуляцию запросов
    console.log(`API ${method} request to ${endpoint}`, data);
    
    // В реальной интеграции здесь был бы настоящий запрос:
    // const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Эмулируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Возвращаем заглушку для демонстрации
    return {
      success: true,
      data: {} as T,
      message: 'Операция выполнена успешно'
    };
  } catch (error) {
    console.error('API Error:', error);
    
    toast({
      title: "Ошибка API",
      description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
      variant: "destructive",
    });
    
    throw error;
  }
}

// Функция для формирования URL с параметрами запроса
export function buildQueryParams(params: Record<string, any>): string {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(`${key}[]`, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}
