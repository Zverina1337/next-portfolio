import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    formats: ['image/avif', 'image/webp'], // Приоритет AVIF > WebP > PNG
    deviceSizes: [640, 750, 828, 1080, 1920], // Оптимизация для разных устройств
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Размеры для responsive images
  },
};

export default nextConfig;
