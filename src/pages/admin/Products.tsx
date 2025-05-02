
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Check,
  X,
  FileEdit,
  Trash2,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Пример данных для таблицы товаров
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Бензопила STIHL MS 180",
    category: "Пилы",
    brand: "STIHL",
    pricePerDay: 500,
    totalUnits: 3,
    availableUnits: 1,
    image: "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 2,
    name: "Триммер STIHL FS 55",
    category: "Триммеры",
    brand: "STIHL",
    pricePerDay: 400,
    totalUnits: 5,
    availableUnits: 2,
    image: "https://images.unsplash.com/photo-1590599145611-5141db0f5d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 3,
    name: "Газонокосилка Husqvarna LC 247",
    category: "Газонокосилки",
    brand: "Husqvarna",
    pricePerDay: 700,
    totalUnits: 2,
    availableUnits: 0,
    image: "https://images.unsplash.com/photo-1592373314553-7e7e922a7ce0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 4,
    name: "Мотоблок Honda FG205",
    category: "Культиваторы",
    brand: "Honda",
    pricePerDay: 1200,
    totalUnits: 2,
    availableUnits: 0,
    image: "https://images.unsplash.com/photo-1589556264800-08ae9e76b4a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "inactive",
  },
  {
    id: 5,
    name: "Генератор Honda EU22i",
    category: "Генераторы",
    brand: "Honda",
    pricePerDay: 900,
    totalUnits: 3,
    availableUnits: 1,
    image: "https://images.unsplash.com/photo-1518456901772-7aad435c4bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 6,
    name: "Минимойка Karcher K5",
    category: "Мойки",
    brand: "Kärcher",
    pricePerDay: 600,
    totalUnits: 4,
    availableUnits: 2,
    image: "https://images.unsplash.com/photo-1621978407950-f015b1431377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 7,
    name: "Снегоуборщик Husqvarna ST 224",
    category: "Снегоуборщики", 
    brand: "Husqvarna",
    pricePerDay: 1100,
    totalUnits: 2,
    availableUnits: 2,
    image: "https://images.unsplash.com/photo-1610990392790-d1717eff5a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "active",
  },
  {
    id: 8,
    name: "Мотобур ECHO EA-410",
    category: "Буры", 
    brand: "ECHO",
    pricePerDay: 800,
    totalUnits: 1,
    availableUnits: 0,
    image: "https://images.unsplash.com/photo-1572981986848-b8832f8d98fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    status: "inactive",
  },
];

const Products = () => {
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    pricePerDay: "",
    totalUnits: "",
    image: ""
  });
  
  const itemsPerPage = 5;
  
  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Пагинация
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Получение уникальных категорий
  const categories = [...new Set(products.map(product => product.category))];
  
  // Обработчик добавления нового товара
  const handleAddProduct = () => {
    // Валидация формы (можно расширить)
    if (!newProduct.name || !newProduct.category || !newProduct.brand || !newProduct.pricePerDay || !newProduct.totalUnits) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }
    
    // Добавление нового товара
    const newProductData = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      brand: newProduct.brand,
      pricePerDay: parseInt(newProduct.pricePerDay),
      totalUnits: parseInt(newProduct.totalUnits),
      availableUnits: parseInt(newProduct.totalUnits),
      image: newProduct.image || "https://images.unsplash.com/photo-1598745945723-9fa8d6c4d3b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      status: "active"
    };
    
    setProducts([...products, newProductData]);
    
    // Сброс формы и закрытие диалога
    setNewProduct({
      name: "",
      category: "",
      brand: "",
      pricePerDay: "",
      totalUnits: "",
      image: ""
    });
    setIsAddProductDialogOpen(false);
  };
  
  // Обработчик удаления товара
  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  // Обработчик изменения статуса товара
  const handleToggleStatus = (id: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === "active" ? "inactive" : "active" }
        : product
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление инструментами</h1>
        <p className="text-gray-500">Добавление, редактирование и просмотр инструментов для проката</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Инструменты</CardTitle>
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить инструмент
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Добавить новый инструмент</DialogTitle>
                  <DialogDescription>
                    Введите информацию о новом инструменте для добавления в каталог
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название</Label>
                    <Input 
                      id="name" 
                      placeholder="Например: Бензопила STIHL MS 180" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <Input 
                        id="category" 
                        placeholder="Например: Пилы" 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Бренд</Label>
                      <Input 
                        id="brand" 
                        placeholder="Например: STIHL" 
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Цена в день (₽)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="Например: 500" 
                        value={newProduct.pricePerDay}
                        onChange={(e) => setNewProduct({...newProduct, pricePerDay: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="units">Количество единиц</Label>
                      <Input 
                        id="units" 
                        type="number" 
                        placeholder="Например: 3" 
                        value={newProduct.totalUnits}
                        onChange={(e) => setNewProduct({...newProduct, totalUnits: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL изображения</Label>
                    <Input 
                      id="image" 
                      placeholder="https://example.com/image.jpg" 
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={handleAddProduct}
                  >
                    Добавить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Просмотр и управление инструментами, доступными для проката.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Фильтры и поиск */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Поиск по названию или бренду..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Статус" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Категория" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Таблица товаров */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Инструмент</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Бренд</TableHead>
                  <TableHead>Цена в день</TableHead>
                  <TableHead>Наличие</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.pricePerDay} ₽</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{product.availableUnits} / {product.totalUnits}</span>
                          {product.availableUnits === 0 && (
                            <Badge variant="destructive" className="mt-1 w-fit">
                              Нет в наличии
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === "active" ? "default" : "secondary"}
                          className={product.status === "active" 
                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {product.status === "active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Просмотр
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="h-4 w-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(product.id)}>
                              {product.status === "active" ? (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Деактивировать
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Активировать
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Не найдено товаров, соответствующих критериям поиска
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано {paginatedProducts.length} из {filteredProducts.length} инструментов
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Страница {currentPage} из {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Products;
