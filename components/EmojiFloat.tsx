"use client";

import { motion } from "framer-motion";
import { Box } from "@mui/joy";

const emojis = ["✨", "🚀", "💡", "⚡", "🎯", "🔥"];

export default function EmojiFloat() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {emojis.map((emoji, index) => (
        <motion.div
          key={index}
          initial={{
            x: Math.random() * 100 - 50,
            y: window.innerHeight + 100,
            opacity: 0,
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.3,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            fontSize: "24px",
            left: `${(index * 16) % 100}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </Box>
  );
}
