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

  headers: async () => isCapacitorExport ? [] : [
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://cdn.sanity.io https://image.mux.com",
            "media-src 'self' blob: https://sonicstream-puntual.grupozgh.cl https://panel.tvstream.cl",
            "connect-src 'self' https://nmwhp66x.api.sanity.io https://www.googletagmanager.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
          ].join("; "),
        },
      ],
    },
  ],

  reactStrictMode: true,
};

export default nextConfig;