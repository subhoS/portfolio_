"use client";

import { motion } from "framer-motion";
import { Box } from "@mui/joy";

export default function FloatingSparkles() {
  const sparkles = Array.from({ length: 5 }, (_, i) => i);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: [0, Math.cos((sparkle / 5) * Math.PI * 2) * 30],
            y: [0, Math.sin((sparkle / 5) * Math.PI * 2) * 30],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            delay: sparkle * 0.2,
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            pointerEvents: "none",
          }}
        >
          ✨
        </motion.div>
      ))}
    </Box>
  );
}
