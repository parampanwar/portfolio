import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Head from 'next/head';
const Index = () => {
  return (
    <>
    <Head>
        <title>Param Panwar - Web and App Developer</title>
        <meta name="description" content="Portfolio of Param Panwar, a Full-Stack Developer creating beautiful web and app experiences with modern technologies." />
        {/* You can add other meta tags here if needed */}
      </Head>
    <div className="min-h-screen"> 
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </div>
    </>
  );
};

export default Index;
