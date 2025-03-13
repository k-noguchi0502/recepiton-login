import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: {
        id: string;
        name: string;
        description?: string | null;
        permissions: string[];
      } | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: {
      id: string;
      name: string;
      description?: string | null;
      permissions: string[];
    } | null;
  }
}