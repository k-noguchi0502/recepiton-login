// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt-edge');

const prisma = new PrismaClient();

async function main() {
  // 既存のロールを確認
  const adminRoleExists = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  const userRoleExists = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  const viewerRoleExists = await prisma.role.findUnique({
    where: { name: 'viewer' },
  });

  // 管理者ロールの作成
  if (!adminRoleExists) {
    await prisma.role.create({
      data: {
        name: 'admin',
        description: '管理者権限',
        permissions: [
          'user:create',
          'user:read',
          'user:update',
          'user:delete',
          'role:create',
          'role:read',
          'role:update',
          'role:delete',
          'page:demo1',
          'page:demo2',
        ],
      },
    });
    console.log('管理者ロールを作成しました');
  }

  // 一般ユーザーロールの作成
  if (!userRoleExists) {
    await prisma.role.create({
      data: {
        name: 'user',
        description: '一般ユーザー権限',
        permissions: [
          'user:read',
          'page:demo1',
        ],
      },
    });
    console.log('一般ユーザーロールを作成しました');
  }

  // 閲覧専用ロールの作成
  if (!viewerRoleExists) {
    await prisma.role.create({
      data: {
        name: 'viewer',
        description: '閲覧専用権限',
        permissions: [
          'user:read',
        ],
      },
    });
    console.log('閲覧専用ロールを作成しました');
  }

  // 管理者ユーザーの確認
  const adminExists = await prisma.user.findFirst({
    where: {
      email: 'admin@example.com',
    },
  });

  // 管理者ユーザーの作成
  if (!adminExists) {
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (adminRole) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await prisma.user.create({
        data: {
          name: '管理者',
          email: 'admin@example.com',
          password: hashedPassword,
          roleId: adminRole.id,
        },
      });
      console.log('管理者ユーザーを作成しました');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });