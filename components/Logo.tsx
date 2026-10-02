/**
 * The SD mark: the tile is a "D", and the "S" inside is a data path between two nodes.
 * Keep in sync with public/logo.svg and app/icon.svg.
 */
export default function Logo({
  size = 32,
  id = "sd",
}: {
  size?: number;
  id?: string;
}) {
  const gradient = `${id}-gradient`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className="logo-mark"
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="8"
          y1="6"
          x2="58"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="0.58" stopColor="#db2777" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M14 6h18a26 26 0 0 1 0 52H14a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z"
        fill={`url(#${gradient})`}
      />
      <path
        d="M39.79 18.5A9 9 0 1 0 32 32a9 9 0 1 1-7.79 13.5"
        fill="none"
        stroke="#fff"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <circle cx="39.79" cy="18.5" r="4.2" fill="#fff" />
      <circle cx="24.21" cy="45.5" r="4.2" fill="#fff" />
    </svg>
  );
}
