
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Пример данных для карточек товаров (можно перенести в отдельный файл)
const PRODUCTS = [
  {
    id: 1,
    name: "Бензопила STIHL MS 180",
    category: "Пилы",
    brand: "STIHL",
    pricePerDay: 500,
    image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 2,
    name: "Триммер STIHL FS 55",
    category: "Триммеры",
    brand: "STIHL",
    pricePerDay: 400,
    image: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 3,
    name: "Газонокосилка Husqvarna LC 247",
    category: "Газонокосилки",
    brand: "Husqvarna",
    pricePerDay: 700,
    image: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 4,
    name: "Мотоблок Honda FG205",
    category: "Культиваторы",
    brand: "Honda",
    pricePerDay: 1200,
    image: "https://images.unsplash.com/photo-1589556264800-08ae9e76b4a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: false,
  },
  {
    id: 5,
    name: "Генератор Honda EU22i",
    category: "Генераторы",
    brand: "Honda",
    pricePerDay: 900,
    image: "https://images.unsplash.com/photo-1518456901772-7aad435c4bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 6,
    name: "Минимойка Karcher K5",
    category: "Мойки",
    brand: "Kärcher",
    pricePerDay: 600,
    image: "https://images.unsplash.com/photo-1621978407950-f015b1431377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 7,
    name: "Снегоуборщик Husqvarna ST 224",
    category: "Снегоуборщики", 
    brand: "Husqvarna",
    pricePerDay: 1100,
    image: "https://images.unsplash.com/photo-1610990392790-d1717eff5a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 8,
    name: "Мотобур ECHO EA-410",
    category: "Буры", 
    brand: "ECHO",
    pricePerDay: 800,
    image: "https://images.unsplash.com/photo-1572981986848-b8832f8d98fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: false,
  },
  {
    id: 9,
    name: "Бензопила Husqvarna 135",
    category: "Пилы",
    brand: "Husqvarna",
    pricePerDay: 550,
    image: "https://images.unsplash.com/photo-1617464985170-8d5b4044b789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 10,
    name: "Триммер Makita EBH252U",
    category: "Триммеры",
    brand: "Makita",
    pricePerDay: 450,
    image: "https://images.unsplash.com/photo-1590599176878-255064ac7c7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 11,
    name: "Насос Bosch GPC 18V-10",
    category: "Насосы",
    brand: "Bosch",
    pricePerDay: 350,
    image: "https://images.unsplash.com/photo-1578763374416-1e891ebf362b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: true,
  },
  {
    id: 12,
    name: "Мотокультиватор Husqvarna TF 325",
    category: "Культиваторы",
    brand: "Husqvarna",
    pricePerDay: 1000,
    image: "https://images.unsplash.com/photo-1571864708139-84d2e9a008c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    availability: false,
  },
];

// Компонент карточки товара
const ProductCard = ({ product }: { product: typeof PRODUCTS[0] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
        <div className="flex justify-between items-center">
          <p className="text-xl font-bold text-orange-600">
            {product.pricePerDay} ₽<span className="text-sm text-gray-600 font-normal">/день</span>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to={`/product/${product.id}`}>Подробнее</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [sortOption, setSortOption] = useState("default");
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    availability: boolean;
  }>({
    categories: [],
    brands: [],
    priceRange: [0, 2000],
    availability: false
  });

  // Получаем категорию из параметров URL
  const categoryFromURL = searchParams.get('category');

  // Применяем фильтры
  const applyFilters = (filters: any) => {
    setActiveFilters(filters);
    
    let filtered = [...PRODUCTS];
    
    // Фильтрация по категориям
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some((category: string) => 
          product.category.toLowerCase().includes(category)
        )
      );
    }
    
    // Фильтрация по брендам
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.some((brand: string) => 
          product.brand.toLowerCase().includes(brand)
        )
      );
    }
    
    // Фильтрация по цене
    filtered = filtered.filter(product => 
      product.pricePerDay >= filters.priceRange[0] && 
      product.pricePerDay <= filters.priceRange[1]
    );
    
    // Фильтрация по наличию
    if (filters.availability) {
      filtered = filtered.filter(product => product.availability);
    }
    
    // Применяем сортировку к отфильтрованным товарам
    applySorting(filtered, sortOption);
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      priceRange: [0, 2000],
      availability: false
    });
    applySorting([...PRODUCTS], sortOption);
  };
  
  // Применение сортировки
  const applySorting = (products: typeof PRODUCTS, option: string) => {
    let sorted = [...products];
    
    switch (option) {
      case "price-asc":
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // По умолчанию оставляем как есть
        break;
    }
    
    setFilteredProducts(sorted);
  };
  
  // Изменение сортировки
  const handleSortChange = (value: string) => {
    setSortOption(value);
    applySorting(filteredProducts, value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Хлебные крошки */}
          <div className="flex items-center text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-orange-600">
              Главная
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="font-medium">Каталог</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-8">Каталог инструментов</h1>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Сайдбар с фильтрами (десктоп) */}
            <div className="hidden lg:block w-72 shrink-0">
              <FilterSidebar 
                onApplyFilters={applyFilters} 
                onResetFilters={resetFilters} 
                className="sticky top-24"
              />
            </div>
            
            {/* Основной контент */}
            <div className="flex-grow">
              {/* Панель управления */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Найдено:</span>
                  <span className="font-medium">{filteredProducts.length} товаров</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Мобильные фильтры */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Фильтры
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                      <FilterSidebar 
                        onApplyFilters={applyFilters} 
                        onResetFilters={resetFilters} 
                        isMobile={true}
                      />
                    </SheetContent>
                  </Sheet>
                  
                  {/* Сортировка */}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Сортировка:</span>
                    <Select value={sortOption} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Сортировка" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">По умолчанию</SelectItem>
                        <SelectItem value="price-asc">По цене (возр.)</SelectItem>
                        <SelectItem value="price-desc">По цене (убыв.)</SelectItem>
                        <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                        <SelectItem value="name-desc">По названию (Я-А)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Активные фильтры */}
              {(activeFilters.categories.length > 0 || 
                activeFilters.brands.length > 0 || 
                activeFilters.availability) && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Фильтры:</span>
                    
                    {activeFilters.categories.map(category => (
                      <div key={category} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                        {category}
                        <button onClick={() => {
                          const newCategories = activeFilters.categories.filter(c => c !== category);
                          applyFilters({...activeFilters, categories: newCategories});
                        }} className="ml-1 text-gray-400 hover:text-gray-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {activeFilters.brands.map(brand => (
                      <div key={brand} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                        {brand}
                        <button onClick={() => {
                          const newBrands = activeFilters.brands.filter(b => b !== brand);
                          applyFilters({...activeFilters, brands: newBrands});
                        }} className="ml-1 text-gray-400 hover:text-gray-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {activeFilters.availability && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                        В наличии
                        <button onClick={() => {
                          applyFilters({...activeFilters, availability: false});
                        }} className="ml-1 text-gray-400 hover:text-gray-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 ml-auto"
                    >
                      Сбросить все
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Сетка товаров */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                  <p className="text-gray-500 mb-4">
                    По вашему запросу не найдено ни одного инструмента. Попробуйте изменить параметры поиска.
                  </p>
                  <Button onClick={resetFilters}>Сбросить фильтры</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Catalog;
