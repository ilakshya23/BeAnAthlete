import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoFeature from "@/components/VideoFeature";
import Programs from "@/components/Programs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <main>
      <Hero content={content.hero} />
      <About content={content.about} />
      <VideoFeature content={content.featureVideo} />
      <Programs programs={content.programs} />
      <Contact content={content.contact} />
      <Footer contact={content.contact} />
    </main>
  );
}
