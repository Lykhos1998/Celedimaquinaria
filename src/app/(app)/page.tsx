import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { moduloInicial } from "@/lib/roles";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  redirect(`/${moduloInicial(session.user.rol)}`);
}
