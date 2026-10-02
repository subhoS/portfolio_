"use client";

export default function GradientBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Top-left orb */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          animation: "orbFloat1 20s ease-in-out infinite",
        }}
      />
      {/* Bottom-right orb */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          animation: "orbFloat2 25s ease-in-out infinite",
        }}
      />
      {/* Center orb */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          animation: "orbFloat3 18s ease-in-out infinite",
          transform: "translateX(-50%)",
        }}
      />
      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.9); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translateX(-50%) translate(0, 0) scale(1); }
          50% { transform: translateX(-50%) translate(30px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
