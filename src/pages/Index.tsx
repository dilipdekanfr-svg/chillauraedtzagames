import Hero from "@/components/Hero";
import GameSection from "@/components/GameSection";
import ChatSection from "@/components/ChatSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <GameSection />
      <ChatSection />
      <Footer />
    </div>
  );
};

export default Index;
