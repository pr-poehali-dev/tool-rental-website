
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

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

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-4">
      <button
        className="flex w-full items-center justify-between text-lg font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
};

type FilterSidebarProps = {
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
};

const FilterSidebar = ({ 
  onApplyFilters, 
  onResetFilters, 
  className = "", 
  isMobile = false,
  onClose
}: FilterSidebarProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [availability, setAvailability] = useState<boolean>(false);

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
      availability
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
    onResetFilters();
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Фильтры</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <FilterSection title="Категории">
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Бренды">
        <div className="space-y-2">
          {BRANDS.map((brand) => (
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Цена в день">
        <div className="px-2">
          <Slider 
            defaultValue={[0, 2000]} 
            max={2000} 
            step={100}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{priceRange[0]} ₽</span>
            <span className="text-sm font-medium">{priceRange[1]} ₽</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      <div className="py-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="availability" 
            checked={availability}
            onCheckedChange={(checked) => setAvailability(checked === true)}
          />
          <label 
            htmlFor="availability"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Только в наличии
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Button 
          onClick={handleApplyFilters}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          Применить
        </Button>
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          className="w-full"
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
