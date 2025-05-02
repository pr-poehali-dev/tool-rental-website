
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

// Пример данных для карточек товаров
const PRODUCTS = [
  {
    id: 1,
    name: "Бензопила STIHL MS 180",
    category: "Пилы",
    pricePerDay: 500,
    image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 2,
    name: "Триммер STIHL FS 55",
    category: "Триммеры",
    pricePerDay: 400,
    image: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 3,
    name: "Газонокосилка Husqvarna LC 247",
    category: "Газонокосилки",
    pricePerDay: 700,
    image: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 4,
    name: "Мотоблок VIKING VH 700",
    category: "Мотоблоки",
    pricePerDay: 1200,
    image: "https://images.unsplash.com/photo-1589556264800-08ae9e76b4a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: false,
  },
  {
    id: 5,
    name: "Генератор Honda EU22i",
    category: "Генераторы",
    pricePerDay: 900,
    image: "https://images.unsplash.com/photo-1518456901772-7aad435c4bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 6,
    name: "Минимойка Karcher K5",
    category: "Мойки",
    pricePerDay: 600,
    image: "https://images.unsplash.com/photo-1621978407950-f015b1431377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
];

const ProductCard = ({ product }: { product: typeof PRODUCTS[0] }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
          {product.category}
        </div>
        {!product.availability && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
              Нет в наличии
            </span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold text-orange-600">
          {product.pricePerDay} ₽<span className="text-sm text-gray-600 font-normal">/день</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/product/${product.id}`}>Подробнее</Link>
        </Button>
        <Button 
          disabled={!product.availability}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> В корзину
        </Button>
      </CardFooter>
    </Card>
  );
};

type ProductGridProps = {
  title?: string;
  showAll?: boolean;
};

const ProductGrid = ({ title = "Популярные инструменты", showAll = false }: ProductGridProps) => {
  // Для главной страницы показываем только 6 товаров, для каталога - все
  const displayProducts = showAll ? PRODUCTS : PRODUCTS.slice(0, 6);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          {!showAll && (
            <Button asChild variant="outline">
              <Link to="/catalog">Все инструменты</Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
