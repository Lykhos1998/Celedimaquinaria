import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Rol } from "@prisma/client";

const USUARIOS: { nombre: string; email: string; rol: Rol }[] = [
  { nombre: "Andrei Gerencia", email: "gerencia@celedimaquinaria.com", rol: Rol.GERENCIA },
  { nombre: "Vicente Vigilante", email: "vigilancia@celedimaquinaria.com", rol: Rol.VIGILANTE },
  { nombre: "Marisol Marketing", email: "marketing@celedimaquinaria.com", rol: Rol.MARKETING },
  { nombre: "Adrián Asesor", email: "ventas@celedimaquinaria.com", rol: Rol.ASESOR_VENTAS },
  { nombre: "Diana Daños", email: "danos@celedimaquinaria.com", rol: Rol.INSPECTOR_DANOS },
  { nombre: "Carlos Compras", email: "compras@celedimaquinaria.com", rol: Rol.COMPRAS },
  { nombre: "Tomás Taller", email: "taller@celedimaquinaria.com", rol: Rol.TALLER },
  { nombre: "Fernanda Finanzas", email: "finanzas@celedimaquinaria.com", rol: Rol.FINANZAS },
  { nombre: "Leo Logística", email: "logistica@celedimaquinaria.com", rol: Rol.LOGISTICA },
  { nombre: "Rita RH", email: "rh@celedimaquinaria.com", rol: Rol.RH },
  { nombre: "Iván Sistemas", email: "ti@celedimaquinaria.com", rol: Rol.SISTEMAS_TI },
];

const PASSWORD_DEMO = "celedi2026";

export async function seedDemoUsers() {
  const passwordHash = await bcrypt.hash(PASSWORD_DEMO, 10);

  for (const u of USUARIOS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
  }

  return { creados: USUARIOS.length, password: PASSWORD_DEMO };
}
