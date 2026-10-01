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

  return (
    <>
      <ProgramDetail
        program={program}
        others={others}
      />
      <Footer contact={content.contact} />
    </>
  );
}
