import "next-auth";
import "next-auth/jwt";

import type { DefaultSession, DefaultJWT } from "next-auth";
import type { UserRole } from "./index";

/* Extend Session & User */
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      mosqueId: string | null;
      emailVerified: Date | null;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    mosqueId: string | null;
    emailVerified?: Date | null;
  }
}

/* Extend JWT */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    mosqueId: string | null;
    emailVerified: Date | null;
  }
}

// declare module "next-auth" {
//   interface User {
//     role: string;
//     mosqueId: string;
//   }

//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       role: string;
//       mosqueId: string;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: string;
//     mosqueId: string;
//   }
// }
