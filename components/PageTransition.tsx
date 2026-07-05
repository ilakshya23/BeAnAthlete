"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const wipe = {
  initial: { scaleY: 1 },
  animate: {
    scaleY: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
  },
  exit: {
    scaleY: 1,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

const content = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Yellow curtain wipe */}
        <motion.div
          variants={wipe}
          style={{ originY: 0 }}
          className="pointer-events-none fixed inset-0 z-[100] bg-bolt"
        />
        <motion.div variants={content}>{children}</motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
