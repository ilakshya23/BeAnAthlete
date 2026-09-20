/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/api/fast-bowling/confirm": ["./private/programs/fast-bowling/*.pdf"],
    },
  },
};

export default nextConfig;
