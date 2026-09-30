"use client";

import { useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { Program } from "@/lib/programs";
import type { SiteContent } from "@/lib/site-content";

type Tab = "home" | "programs" | "contact" | "security";

const emptyProgram = (count: number): Program => ({
  id: `new-program-${count + 1}`,
  number: String(count + 1).padStart(2, "0"),
  title: "New Program",
  subtitle: "Program subtitle",
  blurb: "A short summary shown on the home page.",
  description: "Describe the program and who it is for.",
  heroImage: "/images/program-sprint-drill.jpg",
  secondaryImages: [],
  sections: [{ number: "1", title: "What Is Included", items: ["Add the first program detail."] }],
  highlightTerms: [],
  paidDownload: false,
  closingNote: "Add a strong closing statement for this program.",
  href: `/programs/new-program-${count + 1}`,
});

export default function AdminDashboard({ initialContent, username }: { initialContent: SiteContent; username: string }) {
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<Tab>("home");
  const [selectedProgram, setSelectedProgram] = useState(initialContent.programs[0]?.id || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeProgramIndex = useMemo(
    () => content.programs.findIndex((program) => program.id === selectedProgram),
    [content.programs, selectedProgram]
  );
  const activeProgram = content.programs[activeProgramIndex];

  function updateProgram(patch: Partial<Program>) {
    if (activeProgramIndex < 0) return;
    setContent((current) => ({
      ...current,
      programs: current.programs.map((program, index) =>
        index === activeProgramIndex ? { ...program, ...patch } : program
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = (await response.json()) as SiteContent & { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to save changes.");
      setContent(result);
      setSelectedProgram((current) => result.programs.some((program) => program.id === current) ? current : result.programs[0]?.id || "");
      setMessage("Changes published successfully.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = window.location.hostname.startsWith("admin.") ? "/login" : "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f5c400]">Be An Athlete</p>
            <h1 className="font-display text-2xl">Content Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/45 sm:inline">{username}</span>
            <button onClick={logout} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/40 hover:text-white">Sign out</button>
            <button onClick={save} disabled={saving || tab === "security"} className="rounded-lg bg-[#f5c400] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#ffd633] disabled:opacity-40">
              {saving ? "Publishing…" : "Publish changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav className="border-b border-white/10 p-4 lg:min-h-[calc(100vh-77px)] lg:border-b-0 lg:border-r lg:p-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {([
              ["home", "Home & About"],
              ["programs", "Programs"],
              ["contact", "Get in touch"],
              ["security", "Password"],
            ] as [Tab, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${tab === value ? "bg-[#f5c400] text-black" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <section className="min-w-0 p-5 sm:p-8 lg:p-10">
          {(message || error) && (
            <div className={`mb-6 rounded-xl border px-5 py-4 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"}`}>
              {error || message}
            </div>
          )}
          {tab === "home" && <HomeEditor content={content} setContent={setContent} />}
          {tab === "programs" && (
            <ProgramsEditor
              content={content}
              setContent={setContent}
              activeProgram={activeProgram}
              activeProgramIndex={activeProgramIndex}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
              updateProgram={updateProgram}
            />
          )}
          {tab === "contact" && <ContactEditor content={content} setContent={setContent} />}
          {tab === "security" && <PasswordEditor />}
        </section>
      </div>
    </main>
  );
}

function HomeEditor({ content, setContent }: EditorProps) {
  return (
    <div className="space-y-8">
      <Section title="Main page hero" description="Edit the background video, headline, and subtitle.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Small subtitle" value={content.hero.eyebrow} onChange={(eyebrow) => setContent({ ...content, hero: { ...content.hero, eyebrow } })} />
          <div />
          <Field label="Title — first line" value={content.hero.titleLine1} onChange={(titleLine1) => setContent({ ...content, hero: { ...content.hero, titleLine1 } })} />
          <Field label="Title — highlighted line" value={content.hero.titleLine2} onChange={(titleLine2) => setContent({ ...content, hero: { ...content.hero, titleLine2 } })} />
          <MediaField label="Background video" accept="video/*" value={content.hero.videoUrl} onChange={(videoUrl) => setContent({ ...content, hero: { ...content.hero, videoUrl } })} />
          <MediaField label="Video poster image" accept="image/*" value={content.hero.posterUrl} onChange={(posterUrl) => setContent({ ...content, hero: { ...content.hero, posterUrl } })} />
        </div>
      </Section>

      <Section title="About us" description="Edit the coach photo, heading, and text.">
        <div className="grid gap-5 md:grid-cols-2">
          <MediaField label="About photo" accept="image/*" value={content.about.imageUrl} onChange={(imageUrl) => setContent({ ...content, about: { ...content.about, imageUrl } })} />
          <Field label="Photo alt text" value={content.about.imageAlt} onChange={(imageAlt) => setContent({ ...content, about: { ...content.about, imageAlt } })} />
          <Field label="Section label" value={content.about.eyebrow} onChange={(eyebrow) => setContent({ ...content, about: { ...content.about, eyebrow } })} />
          <Field label="Title (use a new line if needed)" value={content.about.title} onChange={(title) => setContent({ ...content, about: { ...content.about, title } })} />
          <Field label="Name on photo" value={content.about.personName} onChange={(personName) => setContent({ ...content, about: { ...content.about, personName } })} />
          <Field label="Credential" value={content.about.credential} onChange={(credential) => setContent({ ...content, about: { ...content.about, credential } })} />
          <div className="md:col-span-2"><Field label="Credential description" value={content.about.credentialLabel} onChange={(credentialLabel) => setContent({ ...content, about: { ...content.about, credentialLabel } })} /></div>
          {content.about.text.map((paragraph, index) => (
            <div className="md:col-span-2" key={index}>
              <TextArea label={`Paragraph ${index + 1}`} value={paragraph} onChange={(value) => {
                const text = [...content.about.text]; text[index] = value;
                setContent({ ...content, about: { ...content.about, text } });
              }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Feature video" description="This is the video directly below About Us.">
        <div className="grid gap-5 md:grid-cols-2">
          <MediaField label="Video" accept="video/*" value={content.featureVideo.videoUrl} onChange={(videoUrl) => setContent({ ...content, featureVideo: { ...content.featureVideo, videoUrl } })} />
          <MediaField label="Poster image" accept="image/*" value={content.featureVideo.posterUrl} onChange={(posterUrl) => setContent({ ...content, featureVideo: { ...content.featureVideo, posterUrl } })} />
          <Field label="Video title" value={content.featureVideo.title} onChange={(title) => setContent({ ...content, featureVideo: { ...content.featureVideo, title } })} />
          <Field label="Video subtitle" value={content.featureVideo.subtitle} onChange={(subtitle) => setContent({ ...content, featureVideo: { ...content.featureVideo, subtitle } })} />
        </div>
      </Section>
    </div>
  );
}

type ProgramsEditorProps = EditorProps & {
  activeProgram?: Program;
  activeProgramIndex: number;
  selectedProgram: string;
  setSelectedProgram: (id: string) => void;
  updateProgram: (patch: Partial<Program>) => void;
};

function ProgramsEditor(props: ProgramsEditorProps) {
  const { content, setContent, activeProgram, activeProgramIndex, selectedProgram, setSelectedProgram, updateProgram } = props;

  function addProgram() {
    const program = emptyProgram(content.programs.length);
    setContent({ ...content, programs: [...content.programs, program] });
    setSelectedProgram(program.id);
  }

  function removeProgram() {
    if (!activeProgram || !window.confirm(`Delete “${activeProgram.title}”? This takes effect when you publish.`)) return;
    const programs = content.programs.filter((_, index) => index !== activeProgramIndex);
    setContent({ ...content, programs });
    setSelectedProgram(programs[Math.max(0, activeProgramIndex - 1)]?.id || "");
  }

  function move(direction: -1 | 1) {
    const nextIndex = activeProgramIndex + direction;
    if (activeProgramIndex < 0 || nextIndex < 0 || nextIndex >= content.programs.length) return;
    const programs = [...content.programs];
    [programs[activeProgramIndex], programs[nextIndex]] = [programs[nextIndex], programs[activeProgramIndex]];
    setContent({ ...content, programs });
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border border-white/10 bg-white/[0.025] p-3">
        <div className="mb-3 flex items-center justify-between px-2 py-1">
          <h2 className="font-display text-xl">Programs</h2>
          <button onClick={addProgram} className="rounded-md bg-[#f5c400] px-3 py-1.5 text-xs font-bold text-black">+ Add</button>
        </div>
        <div className="space-y-2">
          {content.programs.map((program, index) => (
            <button
              key={`${program.id}-${index}`}
              onClick={() => setSelectedProgram(program.id)}
              className={`w-full rounded-lg border p-3 text-left ${selectedProgram === program.id ? "border-[#f5c400]/60 bg-[#f5c400]/10" : "border-transparent bg-black/20 hover:border-white/10"}`}
            >
              <span className="block text-[10px] font-bold text-[#f5c400]">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-1 block text-sm font-semibold">{program.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {activeProgram ? (
        <Section title={activeProgram.title} description="Edit every part of the program page. The home-page card updates from the same information.">
          <div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => move(-1)} disabled={activeProgramIndex === 0} className="admin-secondary-button">Move up</button>
            <button onClick={() => move(1)} disabled={activeProgramIndex === content.programs.length - 1} className="admin-secondary-button">Move down</button>
            <button onClick={removeProgram} className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">Delete program</button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Program title" value={activeProgram.title} onChange={(title) => updateProgram({ title })} />
            <Field label="URL slug" value={activeProgram.id} onChange={(id) => {
              const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              updateProgram({ id: slug, href: `/programs/${slug}` });
              setSelectedProgram(slug);
            }} />
            <Field label="Subtitle" value={activeProgram.subtitle} onChange={(subtitle) => updateProgram({ subtitle })} />
            <Field label="Highlighted words (comma separated)" value={(activeProgram.highlightTerms || []).join(", ")} onChange={(value) => updateProgram({ highlightTerms: value.split(",").map((term) => term.trim()).filter(Boolean) })} />
            <div className="md:col-span-2"><TextArea label="Home-page summary" value={activeProgram.blurb} onChange={(blurb) => updateProgram({ blurb })} /></div>
            <div className="md:col-span-2"><TextArea label="Program description" value={activeProgram.description} onChange={(description) => updateProgram({ description })} /></div>
            <MediaField label="Main image" accept="image/*" value={activeProgram.heroImage} onChange={(heroImage) => updateProgram({ heroImage })} />
            <label className="flex items-center gap-3 self-end rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
              <input type="checkbox" checked={Boolean(activeProgram.paidDownload)} onChange={(event) => updateProgram({ paidDownload: event.target.checked })} className="h-4 w-4 accent-[#f5c400]" />
              Show the existing paid download checkout
            </label>
            <div className="md:col-span-2"><TextArea label="Closing statement" value={activeProgram.closingNote} onChange={(closingNote) => updateProgram({ closingNote })} /></div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl">Secondary images</h3>
              <button onClick={() => updateProgram({ secondaryImages: [...activeProgram.secondaryImages, ""] })} className="admin-secondary-button">+ Add image</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activeProgram.secondaryImages.map((image, imageIndex) => (
                <div key={imageIndex} className="rounded-xl border border-white/10 p-4">
                  <MediaField label={`Image ${imageIndex + 1}`} accept="image/*" value={image} onChange={(value) => {
                    const secondaryImages = [...activeProgram.secondaryImages]; secondaryImages[imageIndex] = value;
                    updateProgram({ secondaryImages });
                  }} />
                  <button onClick={() => updateProgram({ secondaryImages: activeProgram.secondaryImages.filter((_, index) => index !== imageIndex) })} className="mt-3 text-xs text-red-300 hover:text-red-200">Remove image</button>
                </div>
              ))}
              {activeProgram.secondaryImages.length === 0 && <p className="text-sm text-white/35">No secondary images.</p>}
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">Program sections</h3>
              <button onClick={() => updateProgram({ sections: [...activeProgram.sections, { number: String(activeProgram.sections.length + 1), title: "New Section", items: ["New detail"] }] })} className="admin-secondary-button">+ Add section</button>
            </div>
            {activeProgram.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4 flex gap-3">
                  <div className="flex-1"><Field label={`Section ${sectionIndex + 1} title`} value={section.title} onChange={(title) => {
                    const sections = [...activeProgram.sections]; sections[sectionIndex] = { ...section, title };
                    updateProgram({ sections });
                  }} /></div>
                  <button onClick={() => updateProgram({ sections: activeProgram.sections.filter((_, index) => index !== sectionIndex) })} className="mt-7 h-10 rounded-lg px-3 text-sm text-red-300 hover:bg-red-500/10">Remove</button>
                </div>
                <TextArea label="Bullet points (one per line)" value={section.items.join("\n")} rows={6} onChange={(value) => {
                  const sections = [...activeProgram.sections];
                  sections[sectionIndex] = { ...section, items: value.split("\n") };
                  updateProgram({ sections });
                }} />
              </div>
            ))}
          </div>
        </Section>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/45">Add a program to get started.</div>
      )}
    </div>
  );
}

function ContactEditor({ content, setContent }: EditorProps) {
  const update = (patch: Partial<SiteContent["contact"]>) => setContent({ ...content, contact: { ...content.contact, ...patch } });
  return (
    <Section title="Get in touch" description="These details also update in the website footer.">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section label" value={content.contact.eyebrow} onChange={(eyebrow) => update({ eyebrow })} />
        <Field label="Title" value={content.contact.title} onChange={(title) => update({ title })} />
        <Field label="Phone" value={content.contact.phone} onChange={(phone) => update({ phone })} />
        <Field label="Email" type="email" value={content.contact.email} onChange={(email) => update({ email })} />
        <div className="md:col-span-2"><Field label="Address" value={content.contact.address} onChange={(address) => update({ address })} /></div>
        <div className="md:col-span-2"><TextArea label="Introduction" value={content.contact.description} onChange={(description) => update({ description })} /></div>
      </div>
    </Section>
  );
}

function PasswordEditor() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(""); setError("");
    if (newPassword !== confirmPassword) return setError("The new passwords do not match.");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to change password.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setMessage("Password changed successfully.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to change password.");
    } finally { setLoading(false); }
  }

  return (
    <Section title="Change password" description="Changing the password signs out any other active admin sessions.">
      <form onSubmit={submit} className="max-w-xl space-y-5">
        <Field label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} />
        <Field label="New password" type="password" value={newPassword} onChange={setNewPassword} hint="Use at least 10 characters." />
        <Field label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {message && <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
        <button disabled={loading} className="rounded-lg bg-[#f5c400] px-5 py-3 font-bold text-black disabled:opacity-50">{loading ? "Changing…" : "Change password"}</button>
      </form>
    </Section>
  );
}

type EditorProps = { content: SiteContent; setContent: (content: SiteContent) => void };

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7">
      <div className="mb-7">
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-white/45">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", hint }: { label: string; value: string; onChange: (value: string) => void; type?: string; hint?: string }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none focus:border-[#f5c400]" />
      {hint && <span className="mt-1.5 block text-xs text-white/35">{hint}</span>}
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm leading-relaxed outline-none focus:border-[#f5c400]" />
    </label>
  );
}

function MediaField({ label, value, onChange, accept }: { label: string; value: string; onChange: (value: string) => void; accept: string }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    setError(""); setProgress(0);
    try {
      const blob = await upload(`admin/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        multipart: file.size > 4 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onChange(blob.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="min-w-0">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
      <div className="rounded-lg border border-white/10 bg-black/25 p-3">
        <p className="mb-3 truncate text-xs text-white/45" title={value}>{value || "No file selected"}</p>
        <label className="inline-flex cursor-pointer rounded-md border border-white/15 px-3 py-2 text-xs font-semibold hover:border-[#f5c400] hover:text-[#f5c400]">
          {progress === null ? "Choose and upload" : `Uploading ${progress}%`}
          <input type="file" accept={accept} disabled={progress !== null} className="hidden" onChange={(event) => {
            const file = event.target.files?.[0]; if (file) void uploadFile(file); event.target.value = "";
          }} />
        </label>
        {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
      </div>
    </div>
  );
}
