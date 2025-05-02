
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  ShoppingCart,
  Calendar,
  Check,
  CircleAlert,
  Star,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Пример данных для страницы товара
// В реальном приложении данные будут загружаться с сервера
const PRODUCTS = [
  {
    id: "1",
    name: "Бензопила STIHL MS 180",
    category: "Пилы",
    brand: "STIHL",
    pricePerDay: 500,
    pricePerWeek: 3000,
    pricePerMonth: 10000,
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
    usage: "Идеально подходит для работ по обрезке деревьев в саду, заготовке дров, строительстве из дерева и других бытовых работ. Не рекомендуется для профессионального использования на постоянной основе.",
    images: [
      "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1617464985170-8d5b4044b789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1623953807269-2d672f4daef3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    reviews: [
      {
        id: 1,
        author: "Алексей",
        rating: 5,
        date: "01.03.2025",
        text: "Отличная пила, брал на неделю для распиловки дров. Все супер, заводится с первого раза, режет как по маслу. Аренда оформлена быстро, залог небольшой. Рекомендую!"
      },
      {
        id: 2,
        author: "Михаил",
        rating: 4,
        date: "15.02.2025",
        text: "Хорошая пила для бытовых нужд. Единственный минус - немного шумновата, но это характерно для всех бензопил. Сервис проката на высоте, все объяснили и показали."
      }
    ],
    availability: true,
    deposit: 5000,
    deliveryPrice: 500,
    maintenanceIncluded: true,
    relatedProducts: [2, 9]
  }
];

// Компонент галереи изображений
const ImageGallery = ({ images }: { images: string[] }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square rounded-lg overflow-hidden bg-white">
        <img 
          src={mainImage} 
          alt="Изображение товара" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative rounded-md overflow-hidden w-20 aspect-square flex-shrink-0 transition-all ${
              mainImage === image ? "ring-2 ring-orange-600" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setMainImage(image)}
          >
            <img 
              src={image} 
              alt={`Превью ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Компонент для отображения рейтинга в звездах
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [rentalPeriod, setRentalPeriod] = useState("day");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  // Находим товар по ID
  const product = PRODUCTS.find(p => p.id === id);

  // Если товар не найден, показываем заглушку
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <p className="mb-6">Запрашиваемый товар не существует или был удален.</p>
            <Button asChild>
              <Link to="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Стоимость аренды в зависимости от периода
  const getPriceByPeriod = () => {
    switch (rentalPeriod) {
      case "day": return product.pricePerDay;
      case "week": return product.pricePerWeek;
      case "month": return product.pricePerMonth;
      default: return product.pricePerDay;
    }
  };

  // Расчет общей стоимости
  const totalPrice = getPriceByPeriod() * quantity;

  // Обработчик добавления в корзину
  const handleAddToCart = () => {
    // Здесь будет логика добавления в корзину
    // В рамках следующего этапа
    
    // Переход в корзину
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <div className="flex items-center text-sm mb-6 flex-wrap">
            <Link to="/" className="text-gray-500 hover:text-orange-600">
              Главная
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/catalog" className="text-gray-500 hover:text-orange-600">
              Каталог
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link 
              to={`/catalog?category=${product.category.toLowerCase()}`} 
              className="text-gray-500 hover:text-orange-600"
            >
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium truncate">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка - галерея */}
            <div>
              <ImageGallery images={product.images} />
            </div>
            
            {/* Правая колонка - информация о товаре */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="font-normal text-sm">
                  {product.brand}
                </Badge>
                <Badge variant="outline" className="font-normal text-sm">
                  {product.category}
                </Badge>
                {product.availability ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    В наличии
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Нет в наличии
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium mb-1">Стоимость аренды</h3>
                    <div className="flex gap-4">
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${
                          rentalPeriod === "day" 
                            ? "bg-orange-100 text-orange-800" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => setRentalPeriod("day")}
                      >
                        День
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${
                          rentalPeriod === "week" 
                            ? "bg-orange-100 text-orange-800" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => setRentalPeriod("week")}
                      >
                        Неделя
                      </button>
                      <button 
                        className={`px-3 py-1 rounded-full text-sm ${
                          rentalPeriod === "month" 
                            ? "bg-orange-100 text-orange-800" 
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                        onClick={() => setRentalPeriod("month")}
                      >
                        Месяц
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">
                      {getPriceByPeriod()} ₽
                      <span className="text-sm text-gray-500 font-normal">
                        /{rentalPeriod === "day" ? "день" : rentalPeriod === "week" ? "неделя" : "месяц"}
                      </span>
                    </div>
                    {rentalPeriod !== "day" && (
                      <div className="text-sm text-gray-500">
                        {rentalPeriod === "week" 
                          ? `Экономия ${product.pricePerDay * 7 - product.pricePerWeek} ₽` 
                          : `Экономия ${product.pricePerDay * 30 - product.pricePerMonth} ₽`}
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rental-dates">Даты аренды</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Input 
                          id="start-date" 
                          type="date" 
                          placeholder="Дата начала" 
                          value={selectedStartDate}
                          onChange={(e) => setSelectedStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Input 
                          id="end-date" 
                          type="date" 
                          placeholder="Дата окончания" 
                          value={selectedEndDate}
                          onChange={(e) => setSelectedEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Количество</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <div className="w-12 flex items-center justify-center">
                        {quantity}
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium">Итого:</span>
                    <span className="font-bold text-xl">{totalPrice} ₽</span>
                  </div>
                  
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.availability}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.availability ? "Добавить в корзину" : "Нет в наличии"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <span className="font-medium">Залог:</span> {product.deposit} ₽ (возвращается при сдаче инструмента в исправном состоянии)
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                  <div>
                    <span className="font-medium">Доставка:</span> {product.deliveryPrice} ₽ (в пределах города)
                  </div>
                </div>
                {product.maintenanceIncluded && (
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                      <span className="font-medium">Обслуживание включено:</span> регулярный сервис и замена расходников в случае необходимости
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <CircleAlert className="h-5 w-5 text-orange-600 mt-0.5 mr-2" />
                  <div>
                    Для оформления аренды необходим паспорт и второй документ (водительские права, СНИЛС и т.д.)
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Табы с дополнительной информацией */}
          <div className="mt-12">
            <Tabs defaultValue="specifications">
              <TabsList className="w-full justify-start border-b rounded-none">
                <TabsTrigger value="specifications">Характеристики</TabsTrigger>
                <TabsTrigger value="features">Особенности</TabsTrigger>
                <TabsTrigger value="usage">Применение</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              </TabsList>
              <div className="bg-white p-6 rounded-b-lg shadow-sm mt-px">
                <TabsContent value="specifications" className="m-0">
                  <h3 className="text-xl font-semibold mb-4">Технические характеристики</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b">
                        <span className="text-gray-600">{spec.name}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="features" className="m-0">
                  <h3 className="text-xl font-semibold mb-4">Особенности и преимущества</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="usage" className="m-0">
                  <h3 className="text-xl font-semibold mb-4">Применение и рекомендации</h3>
                  <p className="text-gray-700">{product.usage}</p>
                </TabsContent>
                <TabsContent value="reviews" className="m-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Отзывы клиентов</h3>
                    <Button disabled>Написать отзыв</Button>
                  </div>
                  
                  {product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{review.author}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                          <div className="mb-2">
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-gray-700">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Пока нет отзывов</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Блок консультации */}
          <Card className="mt-10 bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Нужна консультация?</h3>
                  <p className="text-gray-700">
                    Наши специалисты помогут подобрать подходящий инструмент и ответят на ваши вопросы.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    +7 (999) 123-45-67
                  </Button>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700 gap-2">
                    <Link to="/contacts">
                      <Mail className="h-4 w-4" />
                      Написать нам
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Похожие товары */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Похожие инструменты</h2>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/catalog">
                    Все инструменты
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {/* Здесь будут похожие товары из PRODUCTS на основе relatedProducts */}
              {/* Реализация будет добавлена в следующих шагах */}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
