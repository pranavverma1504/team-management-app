import { Connection } from "mongoose";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

declare global{
var mongoose:{
   conn:Connection | null,
   promise:Promise<Connection> | null
}
}

export {}
