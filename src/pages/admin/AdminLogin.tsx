
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/auth.service";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Сбрасываем ошибку
    setError("");
    
    // Проверка полей
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Интеграция с API - вызов сервиса авторизации
      await authService.login({ email, password });
      
      // Перенаправляем на дашборд
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа. Пожалуйста, попробуйте снова.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            ПрокатТул<span className="text-orange-600">Админ</span>
          </h1>
          <p className="text-gray-600 mt-2">Панель управления сайтом проката инструментов</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Введите свои учетные данные для доступа к панели администратора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@prokattul.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Пароль</Label>
                    <Button variant="link" size="sm" className="h-auto p-0 text-sm">
                      Забыли пароль?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600">
            Для демонстрации используйте: admin@prokattul.ru / admin
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
