
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
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
      // Вызов сервиса авторизации
      await authService.login({ email, password });
      
      toast({
        title: "Успешный вход",
        description: "Вы успешно вошли в систему",
      });
      
      // Перенаправляем на главную страницу
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа. Пожалуйста, попробуйте снова.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Вход в личный кабинет</CardTitle>
              <CardDescription>
                Введите свои учетные данные для доступа к аренде инструментов
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
                      placeholder="your@email.com"
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
            <CardFooter className="flex flex-col justify-center text-sm text-center">
              <p className="text-gray-600">
                Еще нет аккаунта?{" "}
                <Link 
                  to="/register" 
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Зарегистрироваться
                </Link>
              </p>
              <p className="text-gray-500 text-xs mt-4">
                Для демонстрации: <br />
                Обычный пользователь: user@example.com / password <br />
                Администратор: admin@prokattul.ru / admin
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
