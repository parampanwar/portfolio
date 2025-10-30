import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen"> 
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </div>
  );
};

export default Index;
