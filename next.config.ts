import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Enable React strict mode for better DX */
  reactStrictMode: true,
  /* Experimental features */
  experimental: {
    /* Turbopack is enabled via CLI flag `next dev --turbopack` */
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth avatars
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// import type { NextConfig } from "next";
// import withPWA from "next-pwa";

// const pwaConfig = withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// });

// const nextConfig: NextConfig = {
//   experimental: {
//     serverActions: { allowedOrigins: ["localhost:3000"] },
//   },
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "utfs.io" },
//     ],
//   },
//     // turbopack: {},
// };

// export default pwaConfig(nextConfig);
