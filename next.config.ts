import type { NextConfig } from "next";

// Modo APK: NEXT_BUILD_MODE=export pnpm build → genera /out para Capacitor
// Modo web: pnpm build → Next.js normal con API routes y SSR en Vercel
const isCapacitorExport = process.env.NEXT_BUILD_MODE === 'export'

const nextConfig: NextConfig = {
  ...(isCapacitorExport && {
    output: 'export',
    // El export estático no soporta image optimization → usar unoptimized
    images: { unoptimized: true },
    // Excluir rutas que requieren server (studio, API routes se quedan en Vercel)
    trailingSlash: true,
  }),

  // Permitir acceso desde dispositivos en la red local (celular)
  allowedDevOrigins: ['192.168.100.45', 'localhost', '127.0.0.1'],

  // Configuración para PWA
  headers: async () => isCapacitorExport ? [] : [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
  ],

  reactStrictMode: true,
};

export default nextConfig;