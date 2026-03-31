import "next-auth";
import "next-auth/jwt";

/* Extend Session & User */
declare module "next-auth" {
  interface User {
    role: string;
    mosqueId: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      mosqueId: string;
    };
  }
}

/* Extend JWT */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    mosqueId: string;
  }
}