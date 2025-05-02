
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative bg-gray-900 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")' }}
      />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Профессиональный инструмент в аренду
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Большой выбор качественного бензоинструмента для любых задач. 
            Выгодные условия проката для частных лиц и организаций.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link to="/catalog">Посмотреть каталог</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
