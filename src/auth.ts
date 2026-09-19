import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Rol } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: Rol;
      nombre: string;
      email: string;
    };
  }
}

type AppToken = { id: string; rol: Rol; nombre: string };

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.activo) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          rol: user.rol,
          nombre: user.nombre,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const t = token as unknown as AppToken;
        t.id = user.id as string;
        t.rol = (user as { rol: Rol }).rol;
        t.nombre = (user as { nombre: string }).nombre;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const t = token as unknown as AppToken;
      session.user.id = t.id;
      session.user.rol = t.rol;
      session.user.nombre = t.nombre;
      return session;
    },
  },
});
