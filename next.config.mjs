/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    // Keep visited pages in the browser's client-side Router Cache longer, so
    // revisiting a page within a session is instant instead of re-fetching.
    staleTimes: {
      dynamic: 180,
      static: 300,
    },
  },
};

export default nextConfig;
