
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  User,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  UserCog,
  Ban,
  UserCheck,
  Trash2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { authService, User as UserType } from "@/services/auth.service";
import { format } from "date-fns";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const itemsPerPage = 8;
  
  // Загрузка пользователей
  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await authService.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    loadUsers();
  }, []);

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query))
    );
  });

  // Получение данных для текущей страницы
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Общее количество страниц
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Просмотр детальной информации о пользователе
  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  // Обработчик поиска
  const handleSearch = () => {
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };

  // Открытие диалога удаления
  const handleOpenDeleteDialog = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Н/Д";
    return format(new Date(dateString), "dd.MM.yyyy");
  };

  // Получение инициалов для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
        <p className="text-gray-500">Просмотр и управление аккаунтами пользователей</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Пользователи</CardTitle>
          <CardDescription>
            Список зарегистрированных пользователей системы.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Поиск */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Поиск по имени, email или телефону..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Найти
            </Button>
          </div>

          {/* Таблица пользователей */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full mr-2"></div>
                        Загрузка пользователей...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {user.avatar && <img src={user.avatar} alt={user.name} />}
                            <AvatarFallback className="bg-orange-100 text-orange-800">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === "admin" ? "destructive" : "secondary"}
                          className={user.role === "admin" 
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200" 
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }
                        >
                          {user.role === "admin" ? "Администратор" : "Пользователь"}
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
                            <DropdownMenuItem onClick={() => handleViewUser(user)}>
                              <User className="h-4 w-4 mr-2" />
                              Просмотр профиля
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="h-4 w-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ban className="h-4 w-4 mr-2" />
                              Блокировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить аккаунт
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Не найдено пользователей, соответствующих критериям поиска
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Показано {paginatedUsers.length} из {filteredUsers.length} пользователей
          </div>
          {totalPages > 1 && (
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
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Диалог просмотра деталей пользователя */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Профиль пользователя</DialogTitle>
            <DialogDescription>
              Детальная информация о пользователе
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center mb-6">
                <Avatar className="h-16 w-16 mr-4">
                  {selectedUser.avatar && <img src={selectedUser.avatar} alt={selectedUser.name} />}
                  <AvatarFallback className="text-lg bg-orange-100 text-orange-800">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.role === "admin" ? "Администратор" : "Пользователь"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Контактная информация</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Информация об аккаунте</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>ID: {selectedUser.id}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Дата регистрации: {formatDate(selectedUser.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Закрыть
            </Button>
            {selectedUser && selectedUser.role !== "admin" && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleOpenDeleteDialog(selectedUser);
                }}
              >
                Удалить аккаунт
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот аккаунт пользователя? Это действие необратимо.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center p-4 bg-red-50 rounded-md mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">Внимание!</p>
                  <p className="text-sm text-red-700">
                    Удаление аккаунта приведет к потере всех данных пользователя, включая историю бронирований.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                toast({
                  title: "Аккаунт удален",
                  description: `Аккаунт пользователя ${selectedUser?.name} был успешно удален.`,
                });
                setIsDeleteDialogOpen(false);
                // В реальном приложении здесь был бы API-запрос на удаление
                loadUsers(); // Перезагружаем список пользователей
              }}
            >
              Удалить аккаунт
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
