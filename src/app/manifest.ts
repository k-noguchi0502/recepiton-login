import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#8936FF",
    background_color: "#2EC6FE",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "PWAサンプルアプリ",
    short_name: "PWAサンプル",
    description: "Next.jsで作成したPWAサンプルアプリ",
    lang: "ja",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],
    shortcuts: [
      {
        name: "ホーム",
        short_name: "ホーム",
        description: "ホーム画面に移動",
        url: "/",
        icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }]
      }
    ]
  }
}