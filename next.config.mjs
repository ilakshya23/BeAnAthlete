/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  agentRules: false,
  outputFileTracingIncludes: {
    "/api/fast-bowling/confirm": ["./private/programs/fast-bowling/*.pdf"],
  },
};

export default nextConfig;
