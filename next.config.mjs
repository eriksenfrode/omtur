const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
      {
        source: '/api/og/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/og/:id',
        destination: '/api/og/:id',
      },
    ]
  },
}
export default nextConfig
