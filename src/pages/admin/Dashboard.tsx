
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Демо-данные для статистики
const stats = [
  {
    title: "Всего заказов",
    value: "124",
    change: "+12%",
    trend: "up",
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    title: "Активные клиенты",
    value: "42",
    change: "+7%",
    trend: "up",
    icon: <Users className="h-5 w-5" />
  },
  {
    title: "Инструменты в аренде",
    value: "28",
    change: "-3%",
    trend: "down",
    icon: <Package className="h-5 w-5" />
  },
  {
    title: "Доход за месяц",
    value: "128 500 ₽",
    change: "+23%",
    trend: "up",
    icon: <DollarSign className="h-5 w-5" />
  }
];

// Демо-данные для последних заказов
const recentOrders = [
  {
    id: "#ORD-5123",
    customer: "Иванов Иван",
    products: ["Бензопила STIHL MS 180", "Триммер STIHL FS 55"],
    total: "2 300 ₽",
    status: "active",
    date: "02.05.2025"
  },
  {
    id: "#ORD-5122",
    customer: "Петров Сергей",
    products: ["Газонокосилка Husqvarna LC 247"],
    total: "4 200 ₽",
    status: "completed",
    date: "01.05.2025"
  },
  {
    id: "#ORD-5121",
    customer: "Сидорова Анна",
    products: ["Минимойка Karcher K5"],
    total: "1 800 ₽",
    status: "completed",
    date: "30.04.2025"
  },
  {
    id: "#ORD-5120",
    customer: "Кузнецов Дмитрий",
    products: ["Генератор Honda EU22i"],
    total: "6 300 ₽",
    status: "active",
    date: "29.04.2025"
  },
  {
    id: "#ORD-5119",
    customer: "Смирнов Алексей",
    products: ["Мотоблок Honda FG205"],
    total: "3 600 ₽",
    status: "active",
    date: "28.04.2025"
  }
];

// Демо-данные для инструментов, требующих обслуживания
const maintenanceItems = [
  {
    name: "Бензопила STIHL MS 180",
    id: "INV-1001",
    issue: "Требуется заточка цепи",
    priority: "high"
  },
  {
    name: "Триммер STIHL FS 55",
    id: "INV-1010",
    issue: "Замена лески",
    priority: "medium"
  },
  {
    name: "Генератор Honda EU22i",
    id: "INV-1023",
    issue: "Плановое ТО",
    priority: "low"
  }
];

// Демо-данные для инструментов, заканчивающих аренду
const endingRentals = [
  {
    name: "Минимойка Karcher K5",
    id: "INV-1005",
    customer: "Иванов Иван",
    returnDate: "03.05.2025"
  },
  {
    name: "Газонокосилка Husqvarna LC 247",
    id: "INV-1008",
    customer: "Петров Сергей",
    returnDate: "04.05.2025"
  },
  {
    name: "Бензопила STIHL MS 180",
    id: "INV-1001",
    customer: "Кузнецов Дмитрий",
    returnDate: "05.05.2025"
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Дашборд</h1>
        <p className="text-gray-500">Обзор статистики и управление прокатом инструментов</p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-orange-100">
                  {stat.icon}
                </div>
                <div className={`flex items-center ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <span>{stat.change}</span>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Последние заказы */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Последние заказы</CardTitle>
              <Button variant="outline" size="sm">Все заказы</Button>
            </div>
            <CardDescription>Информация о недавних и активных заказах</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50 rounded-t-md">
                <div className="col-span-2">Заказ / Клиент</div>
                <div className="col-span-2">Инструменты</div>
                <div>Сумма</div>
                <div>Статус</div>
              </div>
              <div className="divide-y">
                {recentOrders.map((order, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 p-4 text-sm">
                    <div className="col-span-2">
                      <div className="font-medium">{order.id}</div>
                      <div className="text-gray-500">{order.customer}</div>
                      <div className="text-gray-400 text-xs">{order.date}</div>
                    </div>
                    <div className="col-span-2">
                      <ul className="space-y-1">
                        {order.products.map((product, idx) => (
                          <li key={idx} className="truncate">{product}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="font-medium">{order.total}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status === "active" ? "Активен" : "Завершен"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Требует внимания */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Требует внимания</CardTitle>
            <CardDescription>Обратите внимание на эти позиции</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="maintenance">
              <TabsList className="w-full">
                <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
                <TabsTrigger value="ending">Окончание аренды</TabsTrigger>
              </TabsList>
              <TabsContent value="maintenance" className="mt-4 space-y-4">
                {maintenanceItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-md border">
                    <div className={`rounded-full p-1.5 ${
                      item.priority === "high" 
                        ? "bg-red-100" 
                        : item.priority === "medium"
                          ? "bg-orange-100"
                          : "bg-yellow-100"
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        item.priority === "high" 
                          ? "text-red-600" 
                          : item.priority === "medium"
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">ID: {item.id}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.issue}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="ending" className="mt-4 space-y-4">
                {endingRentals.map((rental, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-md border">
                    <div className="rounded-full p-1.5 bg-blue-100">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{rental.name}</div>
                      <div className="text-xs text-gray-500">ID: {rental.id}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Клиент: {rental.customer}
                      </div>
                      <div className="text-sm text-gray-600">
                        Возврат: {rental.returnDate}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
