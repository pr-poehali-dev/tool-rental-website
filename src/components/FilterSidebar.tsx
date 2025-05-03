
import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, X, Filter, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Категории инструментов
const CATEGORIES = [
  { id: "saws", name: "Пилы" },
  { id: "trimmers", name: "Триммеры" },
  { id: "lawnmowers", name: "Газонокосилки" },
  { id: "tillers", name: "Культиваторы" },
  { id: "generators", name: "Генераторы" },
  { id: "pumps", name: "Насосы" },
  { id: "washers", name: "Мойки высокого давления" },
  { id: "snowblowers", name: "Снегоуборщики" },
  { id: "drills", name: "Буры" },
];

// Бренды инструментов
const BRANDS = [
  { id: "stihl", name: "STIHL" },
  { id: "husqvarna", name: "Husqvarna" },
  { id: "bosch", name: "Bosch" },
  { id: "makita", name: "Makita" },
  { id: "honda", name: "Honda" },
  { id: "karcher", name: "Kärcher" },
  { id: "echo", name: "ECHO" },
];

// Типы фильтров
export interface Filters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  availability: boolean;
  powerSource?: string; // Новое: источник питания
  weight?: string; // Новое: вес
}

type FilterSidebarProps = {
  onApplyFilters: (filters: Filters) => void;
  onResetFilters: () => void;
  initialFilters?: Partial<Filters>;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
};

const FilterSidebar = ({ 
  onApplyFilters, 
  onResetFilters, 
  initialFilters,
  className = "", 
  isMobile = false,
  onClose
}: FilterSidebarProps) => {
  // Состояние фильтров
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands || []);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [0, 2000]);
  const [availability, setAvailability] = useState<boolean>(initialFilters?.availability || false);
  const [powerSource, setPowerSource] = useState<string>(initialFilters?.powerSource || "");
  const [weight, setWeight] = useState<string>(initialFilters?.weight || "");
  const [searchQuery, setSearchQuery] = useState(""); // Для поиска категорий/брендов
  
  // Отслеживаем количество активных фильтров
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Подсчёт активных фильтров
  useEffect(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 2000) count++;
    if (availability) count++;
    if (powerSource) count++;
    if (weight) count++;
    setActiveFiltersCount(count);
  }, [selectedCategories, selectedBrands, priceRange, availability, powerSource, weight]);

  // Фильтруем категории по поисковому запросу
  const filteredCategories = CATEGORIES.filter(
    category => category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Фильтруем бренды по поисковому запросу
  const filteredBrands = BRANDS.filter(
    brand => brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId]);
    } else {
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    }
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange,
      availability,
      powerSource,
      weight
    });
    
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setAvailability(false);
    setPowerSource("");
    setWeight("");
    setSearchQuery("");
    onResetFilters();
  };

  // Функция для выбора всех категорий
  const selectAllCategories = () => {
    setSelectedCategories(CATEGORIES.map(cat => cat.id));
  };

  // Функция для снятия выбора со всех категорий
  const unselectAllCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Заголовок для мобильной версии */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Фильтры</h2>
            {activeFiltersCount > 0 && (
              <Badge 
                className="ml-2 bg-orange-600" 
                variant="secondary"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="p-4">
        {/* Поле поиска категорий и брендов */}
        <div className="mb-4">
          <Input 
            placeholder="Поиск по категориям и брендам..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Примечание о количестве активных фильтров */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Активных фильтров: {activeFiltersCount}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="h-auto py-1 px-2 text-orange-600"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Сбросить все
            </Button>
          </div>
        )}

        {/* Используем компонент аккордеона для разделов фильтров */}
        <Accordion type="multiple" defaultValue={["categories", "brands", "price"]}>
          <AccordionItem value="categories">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                Категории
                {selectedCategories.length > 0 && (
                  <Badge className="ml-2 bg-orange-100 text-orange-800" variant="secondary">
                    {selectedCategories.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {filteredCategories.length === 0 ? (
                <Alert variant="default" className="my-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Категории не найдены по запросу "{searchQuery}"
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <Button 
                      variant="link" 
                      onClick={selectAllCategories} 
                      className="h-auto p-0 text-orange-600"
                    >
                      Выбрать все
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={unselectAllCategories} 
                      className="h-auto p-0 text-gray-500"
                    >
                      Сбросить
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {filteredCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.id, checked === true)
                          }
                        />
                        <label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brands">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                Бренды
                {selectedBrands.length > 0 && (
                  <Badge className="ml-2 bg-orange-100 text-orange-800" variant="secondary">
                    {selectedBrands.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {filteredBrands.length === 0 ? (
                <Alert variant="default" className="my-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Бренды не найдены по запросу "{searchQuery}"
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {filteredBrands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand.id}`} 
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={(checked) => 
                          handleBrandChange(brand.id, checked === true)
                        }
                      />
                      <label 
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {brand.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                Цена в день
                {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                  <Badge className="ml-2 bg-orange-100 text-orange-800" variant="secondary">
                    {priceRange[0]}-{priceRange[1]} ₽
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-2 py-2">
                <Slider 
                  defaultValue={[0, 2000]} 
                  max={2000} 
                  step={50}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {priceRange[0]} ₽
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {priceRange[1]} ₽
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additional">
            <AccordionTrigger className="py-2">
              Дополнительные фильтры
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Наличие */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="availability" 
                    checked={availability}
                    onCheckedChange={(checked) => setAvailability(checked === true)}
                  />
                  <label 
                    htmlFor="availability"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Только в наличии
                  </label>
                </div>

                {/* Новое: источник питания */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Источник питания</label>
                  <div className="flex gap-2 flex-wrap">
                    <Badge 
                      className={`cursor-pointer ${powerSource === 'electric' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setPowerSource(powerSource === 'electric' ? '' : 'electric')}
                    >
                      Электрический
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${powerSource === 'petrol' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setPowerSource(powerSource === 'petrol' ? '' : 'petrol')}
                    >
                      Бензиновый
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${powerSource === 'battery' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setPowerSource(powerSource === 'battery' ? '' : 'battery')}
                    >
                      Аккумуляторный
                    </Badge>
                  </div>
                </div>

                {/* Новое: вес инструмента */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Вес инструмента</label>
                  <div className="flex gap-2 flex-wrap">
                    <Badge 
                      className={`cursor-pointer ${weight === 'light' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setWeight(weight === 'light' ? '' : 'light')}
                    >
                      Легкий (до 5 кг)
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${weight === 'medium' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setWeight(weight === 'medium' ? '' : 'medium')}
                    >
                      Средний (5-15 кг)
                    </Badge>
                    <Badge 
                      className={`cursor-pointer ${weight === 'heavy' ? 'bg-orange-100 border border-orange-600 text-orange-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      variant="outline"
                      onClick={() => setWeight(weight === 'heavy' ? '' : 'heavy')}
                    >
                      Тяжелый (от 15 кг)
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-2 mt-6">
          <Button 
            onClick={handleApplyFilters}
            className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 
              ? `Применить фильтры (${activeFiltersCount})` 
              : "Применить фильтры"
            }
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="w-full"
          >
            Сбросить все фильтры
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
