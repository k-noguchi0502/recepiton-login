import { MetadataRoute } from 'next'

// 静的エクスポートのための設定
export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TOCH-HUB',
    short_name: 'TOCH-HUB',
    description: 'TOCH-HUBのアプリ',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    orientation: 'portrait',
    scope: '/',
    lang: 'ja',
    dir: 'ltr',
    prefer_related_applications: false,
    related_applications: [],
    categories: ['productivity', 'utilities'],
    shortcuts: [
      {
        name: 'ダッシュボード',
        short_name: 'ダッシュボード',
        description: 'ダッシュボードを表示',
        url: '/dashboard',
        icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '96x96' }],
      },
    ]
  }
}