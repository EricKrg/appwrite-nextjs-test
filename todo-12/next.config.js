/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/pocketbase/:path*',
  //       destination: 'http://127.0.0.1:8090/:path*',

  //     },
  //   ]
  // }
}

module.exports = nextConfig
