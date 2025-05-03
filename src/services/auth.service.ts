
import { apiRequest } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  created_at?: string;
}

class AuthService {
  // Определяем ключи для хранения в localStorage
  private USER_TOKEN_KEY = "userToken";
  private USER_DATA_KEY = "userData";
  private ADMIN_TOKEN_KEY = "adminToken";
  private ADMIN_DATA_KEY = "adminUser";
  
  // Авторизация пользователя
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем заглушку
    const response = await new Promise<LoginResponse>((resolve, reject) => {
      setTimeout(() => {
        // Проверка для админа
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
        } 
        // Проверка для обычного пользователя
        else if (credentials.email === "user@example.com" && credentials.password === "password") {
          resolve({
            user: {
              id: 2,
              name: "Иван Иванов",
              email: "user@example.com",
              role: "user",
              phone: "+7 (999) 123-45-67",
              created_at: "2024-12-10T14:30:00Z"
            },
            token: "demo-token-for-user"
          });
        } else {
          // Проверка сохраненных пользователей в localStorage
          const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
          const user = registeredUsers.find((u: any) => 
            u.email === credentials.email && u.password === credentials.password
          );
          
          if (user) {
            const { password, ...userWithoutPassword } = user;
            resolve({
              user: {
                ...userWithoutPassword,
                role: "user"
              },
              token: `demo-token-for-${userWithoutPassword.id}`
            });
          } else {
            reject(new Error("Неверный email или пароль"));
          }
        }
      }, 800);
    });

    // Сохраняем данные в localStorage в зависимости от роли
    if (response.user.role === "admin") {
      localStorage.setItem(this.ADMIN_TOKEN_KEY, response.token);
      localStorage.setItem(this.ADMIN_DATA_KEY, JSON.stringify(response.user));
    } else {
      localStorage.setItem(this.USER_TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.user));
    }

    return response;
  }

  // Регистрация нового пользователя
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем заглушку
    return new Promise<LoginResponse>((resolve, reject) => {
      setTimeout(() => {
        // Получаем существующих пользователей
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        
        // Проверяем, не занят ли email
        if (registeredUsers.some((user: any) => user.email === userData.email)) {
          reject(new Error("Пользователь с таким email уже зарегистрирован"));
          return;
        }
        
        // Создаем нового пользователя
        const newUser = {
          id: registeredUsers.length + 10, // Используем смещение, чтобы не конфликтовать с демо-пользователями
          name: userData.name,
          email: userData.email,
          password: userData.password, // В реальном приложении пароль будет хешироваться
          phone: userData.phone || "",
          role: "user",
          created_at: new Date().toISOString()
        };
        
        // Сохраняем в localStorage для демо
        registeredUsers.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        
        // Удаляем пароль из ответа
        const { password, ...userWithoutPassword } = newUser;
        
        // Формируем ответ
        const response = {
          user: userWithoutPassword as User,
          token: `demo-token-for-${newUser.id}`
        };
        
        // Сохраняем данные пользователя
        localStorage.setItem(this.USER_TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.user));
        
        resolve(response);
      }, 1000);
    });
  }

  // Получение профиля пользователя
  async getProfile(isAdmin = false): Promise<User> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем данные из localStorage
    const storageKey = isAdmin ? this.ADMIN_DATA_KEY : this.USER_DATA_KEY;
    const userData = localStorage.getItem(storageKey);
    
    if (!userData) {
      throw new Error("Пользователь не аутентифицирован");
    }
    
    return JSON.parse(userData) as User;
  }

  // Выход из системы
  async logout(isAdmin = false): Promise<void> {
    // В реальном приложении здесь будет запрос к API для инвалидации токена
    if (isAdmin) {
      localStorage.removeItem(this.ADMIN_TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_DATA_KEY);
    } else {
      localStorage.removeItem(this.USER_TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
    }
  }

  // Проверка авторизации
  isAuthenticated(isAdmin = false): boolean {
    const tokenKey = isAdmin ? this.ADMIN_TOKEN_KEY : this.USER_TOKEN_KEY;
    return !!localStorage.getItem(tokenKey);
  }
  
  // Получение списка всех пользователей (только для админа)
  async getAllUsers(): Promise<User[]> {
    // В реальном приложении здесь будет запрос к API
    // Для демонстрации используем заглушку
    return new Promise<User[]>((resolve) => {
      setTimeout(() => {
        // Базовый набор пользователей
        const defaultUsers = [
          {
            id: 2,
            name: "Иван Иванов",
            email: "user@example.com",
            role: "user",
            phone: "+7 (999) 123-45-67",
            created_at: "2024-12-10T14:30:00Z"
          },
          {
            id: 3,
            name: "Петр Петров",
            email: "petrov@example.com",
            role: "user",
            phone: "+7 (999) 987-65-43",
            created_at: "2025-01-05T10:15:00Z"
          },
          {
            id: 4,
            name: "Анна Сидорова",
            email: "sidorova@example.com",
            role: "user",
            phone: "+7 (999) 555-44-33",
            created_at: "2025-02-12T09:20:00Z"
          }
        ];
        
        // Добавляем зарегистрированных пользователей из localStorage
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
        const registeredUsersWithoutPasswords = registeredUsers.map((user: any) => {
          const { password, ...rest } = user;
          return rest;
        });
        
        resolve([...defaultUsers, ...registeredUsersWithoutPasswords]);
      }, 800);
    });
  }
}

export const authService = new AuthService();
