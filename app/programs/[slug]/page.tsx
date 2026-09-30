import { testimonials } from "@/lib/testimonials";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ProgramDetail from "@/components/ProgramDetail";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getSiteContent();
  const programs = content.programs;
  const { slug } = await params;
  const program = programs.find((p) => p.id === slug);
  if (!program) return notFound();

  const others = programs.filter((p) => p.id !== program.id);

  const relevantTestimonials =
    program.id === "fast-bowling-performance"
      ? []
      : testimonials.filter((t) => {
          if (t.program === "both") return true;
          if (program.id === "one-on-one-program") {
            return t.program === "programming";
          }
          if (program.id === "one-on-one-coaching") {
            return t.program === "coaching";
          }
          return false;
        });

  return (
    <>
      <ProgramDetail
        program={program}
        others={others}
        testimonials={relevantTestimonials}
      />
      <Footer contact={content.contact} />
    </>
  );
}
