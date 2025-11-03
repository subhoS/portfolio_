"use client";

import { motion } from "framer-motion";
import { Box } from "@mui/joy";

const confetti = Array.from({ length: 20 }, (_, i) => i);

export default function ClickConfetti({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {confetti.map((item) => (
        <motion.div
          key={item}
          initial={{
            x: Math.random() * window.innerWidth,
            y: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight,
            rotate: Math.random() * 360,
            opacity: 0,
          }}
          transition={{
            duration: 2,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            fontSize: "24px",
          }}
        >
          {"🎉🎊✨🌟💫⭐🎯🚀"[Math.floor(Math.random() * 8)]}
        </motion.div>
      ))}
    </Box>
  );
}
