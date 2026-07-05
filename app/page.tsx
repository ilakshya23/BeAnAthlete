import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoFeature from "@/components/VideoFeature";
import Programs from "@/components/Programs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <VideoFeature />
      <Programs />
      <Contact />
      <Footer />
    </main>
  );
}
