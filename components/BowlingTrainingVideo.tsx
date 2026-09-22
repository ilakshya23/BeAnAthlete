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
    <section className="bg-ink px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_0.75fr] md:gap-16">
        <div>
          <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest2 text-bolt">
            Training In Action
          </p>
          <h2 className="font-display text-4xl leading-[0.95] text-chalk sm:text-5xl">
            Fast Bowling
            <br />
            Performance Work
          </h2>
          <p className="mt-6 max-w-lg font-body leading-relaxed text-steel">
            Structured field sessions develop the speed, movement quality,
            conditioning, and repeatable power fast bowlers need to perform.
          </p>
        </div>

        <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden border border-white/10 bg-charcoal">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster="/images/fast-bowling-video-poster.jpg"
            aria-label="Fast bowling performance training montage"
          >
            <source src="/videos/fast-bowling-training.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}
