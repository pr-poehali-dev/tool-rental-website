
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductGrid from "@/components/ProductGrid";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
        <ProductGrid />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
