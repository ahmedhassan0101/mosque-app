import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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
