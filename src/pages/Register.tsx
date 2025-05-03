
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Пожалуйста, заполните все обязательные поля");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    if (!formData.agreeToTerms) {
      setError("Необходимо согласиться с условиями использования");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Сбрасываем ошибку
    setError("");
    
    // Проверка формы
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Вызов сервиса регистрации
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });
      
      toast({
        title: "Регистрация успешна",
        description: "Ваш аккаунт успешно создан",
      });
      
      // Перенаправляем на главную страницу
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации. Пожалуйста, попробуйте снова.");
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
              <CardTitle>Регистрация</CardTitle>
              <CardDescription>
                Создайте аккаунт для доступа к аренде инструментов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Имя <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Пароль <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Подтверждение пароля <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-sm text-gray-600"
                    >
                      Я согласен с <a href="/terms" className="text-orange-600 hover:underline">правилами использования</a> и <a href="/privacy" className="text-orange-600 hover:underline">политикой конфиденциальности</a>
                    </label>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md mt-6 flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    Поля, отмеченные <span className="text-red-500">*</span>, обязательны для заполнения.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-center">
              <p className="text-gray-600">
                Уже есть аккаунт?{" "}
                <Link 
                  to="/login" 
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Войти
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
