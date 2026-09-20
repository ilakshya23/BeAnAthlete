import { programs } from "@/lib/programs";
import { testimonials } from "@/lib/testimonials";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ProgramDetail from "@/components/ProgramDetail";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.id }));
}

export default function ProgramPage({ params }: { params: { slug: string } }) {
  const program = programs.find((p) => p.id === params.slug);
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
      <Footer />
    </>
  );
}
