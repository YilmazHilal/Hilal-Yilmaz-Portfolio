import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/CV_Hilal-Yılmaz_EndüstriMühendisliği.pdf',
        destination: '/cv.pdf',
      },
      {
        source: '/CV_Hilal-Yılmaz_IndustrialEngineer.pdf',
        destination: '/cv.pdf',
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com', protocol: 'https' },
      { hostname: 'avatars.githubusercontent.com', protocol: 'https' },
      { hostname: 'imgur.com', protocol: 'https' },
      { hostname: 'media2.dev.to', protocol: 'https' },
    ],
  },
};

export default nextConfig;
