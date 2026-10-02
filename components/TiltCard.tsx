"use client";

import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function TiltCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  function handleMouseMove(e: React.MouseEvent) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 16,
          height: "100%",
        }}
      >
        {/* Glow overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(124,58,237,0.15) 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 1,
            transition: "background 0.15s ease",
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
