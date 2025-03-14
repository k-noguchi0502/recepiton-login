import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

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
          'company:create',
          'company:read',
          'company:update',
          'company:delete',
          'department:create',
          'department:read',
          'department:update',
          'department:delete',
          'settings:read',
          'settings:update',
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
          'company:read',
          'department:read',
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
          'company:read',
          'department:read',
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
      // bcryptjsを使用してパスワードをハッシュ化
      const hashedPassword = bcryptjs.hashSync('admin123', 10);
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

  // サンプル会社の作成
  const company1Exists = await prisma.company.findFirst({
    where: {
      name: '株式会社サンプル',
    },
  });

  const company2Exists = await prisma.company.findFirst({
    where: {
      name: 'テスト株式会社',
    },
  });

  let company1, company2;

  if (!company1Exists) {
    company1 = await prisma.company.create({
      data: {
        name: '株式会社サンプル',
        description: 'サンプル会社の説明文です',
        address: '東京都渋谷区サンプル町1-1-1',
        phone: '03-1234-5678',
        email: 'info@sample.co.jp',
        website: 'https://sample.co.jp',
      },
    });
    console.log('サンプル会社1を作成しました');
  } else {
    company1 = company1Exists;
  }

  if (!company2Exists) {
    company2 = await prisma.company.create({
      data: {
        name: 'テスト株式会社',
        description: 'テスト用の会社です',
        address: '大阪府大阪市テスト区2-2-2',
        phone: '06-9876-5432',
        email: 'info@test.co.jp',
        website: 'https://test.co.jp',
      },
    });
    console.log('サンプル会社2を作成しました');
  } else {
    company2 = company2Exists;
  }

  // サンプル部署の作成
  if (company1) {
    const dept1Exists = await prisma.department.findFirst({
      where: {
        name: '営業部',
        companyId: company1.id,
      },
    });

    const dept2Exists = await prisma.department.findFirst({
      where: {
        name: '開発部',
        companyId: company1.id,
      },
    });

    if (!dept1Exists) {
      await prisma.department.create({
        data: {
          name: '営業部',
          description: '営業活動を担当する部署',
          companyId: company1.id,
        },
      });
      console.log('営業部を作成しました');
    }

    if (!dept2Exists) {
      await prisma.department.create({
        data: {
          name: '開発部',
          description: 'システム開発を担当する部署',
          companyId: company1.id,
        },
      });
      console.log('開発部を作成しました');
    }
  }

  if (company2) {
    const dept3Exists = await prisma.department.findFirst({
      where: {
        name: '人事部',
        companyId: company2.id,
      },
    });

    const dept4Exists = await prisma.department.findFirst({
      where: {
        name: '経理部',
        companyId: company2.id,
      },
    });

    if (!dept3Exists) {
      await prisma.department.create({
        data: {
          name: '人事部',
          description: '人事・採用を担当する部署',
          companyId: company2.id,
        },
      });
      console.log('人事部を作成しました');
    }

    if (!dept4Exists) {
      await prisma.department.create({
        data: {
          name: '経理部',
          description: '経理・財務を担当する部署',
          companyId: company2.id,
        },
      });
      console.log('経理部を作成しました');
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