import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable the experimental React Compiler unless you have the
  // babel plugin installed. Setting to false avoids Next.js attempting
  // to resolve `babel-plugin-react-compiler`.
  reactCompiler: false,
};

export default nextConfig;
