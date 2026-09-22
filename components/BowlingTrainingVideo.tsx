"use client";

import { useEffect, useRef } from "react";

export default function BowlingTrainingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-ink px-6 py-20 md:min-h-[82svh] md:px-10 md:py-28">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[center_38%] md:object-[center_34%]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/fast-bowling-video-poster.jpg"
        aria-label="Fast bowling performance training montage"
      >
        <source src="/videos/fast-bowling-training.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
          Training In Action
        </p>
        <h2 className="font-display text-4xl leading-[0.95] text-chalk sm:text-5xl md:text-6xl">
          Fast Bowling
          <br />
          Performance Work
        </h2>
        <p className="mt-6 max-w-lg font-body leading-relaxed text-chalk/80">
          Structured field sessions develop the speed, movement quality,
          conditioning, and repeatable power fast bowlers need to perform.
        </p>
      </div>
    </section>
  );
}
