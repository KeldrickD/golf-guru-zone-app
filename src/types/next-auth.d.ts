import NextAuth, { DefaultSession } from "next-auth";
import { Subscription } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscription?: Subscription | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    stripeCustomerId?: string | null;
  }
} 