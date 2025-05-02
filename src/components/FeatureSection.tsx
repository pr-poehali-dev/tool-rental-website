
import { Shield, Clock, Truck, CreditCard } from "lucide-react";

const features = [
  {
    icon: <Shield className="h-10 w-10 text-orange-600" />,
    title: "Качественный инструмент",
    description: "Мы предлагаем только профессиональный инструмент от проверенных производителей"
  },
  {
    icon: <Clock className="h-10 w-10 text-orange-600" />,
    title: "Гибкие сроки аренды",
    description: "Берите инструмент на день, неделю или месяц на выгодных условиях"
  },
  {
    icon: <Truck className="h-10 w-10 text-orange-600" />,
    title: "Доставка по городу",
    description: "Привезем инструмент к вам на объект в удобное время"
  },
  {
    icon: <CreditCard className="h-10 w-10 text-orange-600" />,
    title: "Удобная оплата",
    description: "Принимаем наличные, банковские карты и безналичный расчет"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 hover:shadow-lg rounded-lg transition-shadow">
              <div className="inline-flex justify-center items-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
