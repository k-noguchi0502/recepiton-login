/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15.2.1の型定義問題を解決するための設定
  experimental: {
    typedRoutes: false,
    // React 19との互換性を向上させる設定
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // 外部パッケージの設定
  serverExternalPackages: ['bcrypt-edge'],
  typescript: {
    // ビルド時の型チェックをスキップ（開発時のみ型チェックを行う）
    ignoreBuildErrors: true,
  },
  // SSRでのReactエラーを無視する設定
  reactStrictMode: false,
  // ビルド時のプリレンダリングのタイムアウトを増やす（デフォルトは60秒）
  staticPageGenerationTimeout: 180,
  // サーバーサイドレンダリングを使用
  output: 'standalone',
  // 特定のページをビルドから除外
  excludeDefaultMomentLocales: true,
  // ページの拡張子を指定
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // サーバーサイドのページキャッシュの設定
  onDemandEntries: {
    // サーバーサイドのページキャッシュの有効期間（秒）
    maxInactiveAge: 25 * 1000,
    // 同時にキャッシュするページの最大数
    pagesBufferLength: 2,
  },
  // X-Powered-Byヘッダーを無効化
  poweredByHeader: false,
  // URLの末尾にスラッシュを追加
  trailingSlash: true,
  // ビルドディレクトリを指定
  distDir: '.next',
  webpack: (config, { isServer }) => {
    // クライアントサイドでbcryptを使用しないようにする
    if (!isServer) {
      // Node.jsモジュールをブラウザで使用しないようにする
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        'aws-sdk': false,
        'mock-aws-s3': false,
        nock: false,
        crypto: false,
        stream: false,
        os: false,
        path: false,
        constants: false,
        assert: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        buffer: false,
        events: false
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 