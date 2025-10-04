import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/journal',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
