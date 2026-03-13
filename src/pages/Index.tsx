import Hero from "@/components/Hero";
import GameSection from "@/components/GameSection";
import QASection from "@/components/QASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <GameSection />
      <QASection />
      <Footer />
    </div>
  );
};

export default Index;
