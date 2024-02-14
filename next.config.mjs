/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["http://localhost:8888", "*.my-proxy.com"],
    },
  },
};

export default nextConfig;
