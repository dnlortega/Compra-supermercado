import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
    // Otimizações de imagem
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Otimizações de compilação
  swcMinify: true,
  // Otimizações de performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
};

export default nextConfig;
