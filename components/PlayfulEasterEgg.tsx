"use client";

import { Box } from "@mui/joy";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Keep shipping! 🚀",
  "Clean code ftw 💪",
  "Performance matters ⚡",
  "Ship it! 🎯",
  "Scalable > Perfect 🏗️",
  "You got this! 💻",
  "Error handling is 🔥",
  "Tests? Yes please ✅",
];

export default function PlayfulEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks % 3 === 0) {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          transition: "transform 0.2s",
          display: "inline-block",
          "&:hover": {
            transform: "scale(1.1)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        {/* Clickable element - Logo or text */}
        <span style={{ userSelect: "none" }}>✨</span>
      </Box>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                bgcolor: "var(--surface-secondary)",
                border: "2px solid var(--accent)",
                borderRadius: "12px",
                px: 3,
                py: 2,
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "16px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {message}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
