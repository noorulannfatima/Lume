import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "sjdbaptw58.ufs.sh",// for uploading attachment
      },
    ],
  },
  serverExternalPackages: ['sequelize', 'pg'],
  reactCompiler: true,
};

export default nextConfig;
