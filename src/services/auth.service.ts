
import { apiRequest } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем заглушку
    const response = await new Promise<LoginResponse>((resolve) => {
      setTimeout(() => {
        if (credentials.email === "admin@prokattul.ru" && credentials.password === "admin") {
          resolve({
            user: {
              id: 1,
              name: "Администратор",
              email: "admin@prokattul.ru",
              role: "admin"
            },
            token: "demo-token-for-admin-panel"
          });
        } else {
          throw new Error("Неверный email или пароль");
        }
      }, 800);
    });

    // Сохраняем данные в localStorage
    localStorage.setItem("adminToken", response.token);
    localStorage.setItem("adminUser", JSON.stringify(response.user));

    return response;
  }

  async getProfile(): Promise<User> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем данные из localStorage
    const userData = localStorage.getItem("adminUser");
    
    if (!userData) {
      throw new Error("Пользователь не аутентифицирован");
    }
    
    return JSON.parse(userData) as User;
  }

  async logout(): Promise<void> {
    // В реальном приложении здесь будет запрос к API для инвалидации токена
    // Для демонстрации просто удаляем данные из localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("adminToken");
  }
}

export const authService = new AuthService();
