import { PrismaClient } from '@prisma/client';

// グローバル変数の型定義
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ブラウザ環境かどうかを判定
const isBrowser = typeof window !== 'undefined';
const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';

// Prismaクライアントの初期化
let prisma: PrismaClient;

if (!isBrowser && !isEdgeRuntime) {
  // サーバーサイドでの実行
  if (process.env.NODE_ENV === 'production') {
    // 本番環境では新しいインスタンスを作成
    prisma = new PrismaClient({
      log: ['error'],
    });
  } else {
    // 開発環境ではホットリロード対策としてグローバル変数を使用
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    prisma = globalForPrisma.prisma;
  }
} else {
  // クライアントサイドやエッジランタイムでは空のモックを提供
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma = new Proxy({} as any, {
    get: (target, prop) => {
      // モデルアクセス（user, role, company, department）
      if (typeof prop === 'string' && ['user', 'role', 'company', 'department'].includes(prop)) {
        return new Proxy({}, {
          get: (_, method) => {
            if (typeof method === 'string' && ['findUnique', 'findMany', 'create', 'update', 'delete', 'upsert'].includes(method)) {
              return () => {
                console.error(`Prisma Client Error: ${String(prop)}.${String(method)} was called in browser environment`);
                return Promise.resolve(null);
              };
            }
            return undefined;
          }
        });
      }
      return undefined;
    }
  }) as PrismaClient;
}

export { prisma }; 