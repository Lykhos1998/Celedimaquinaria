import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  // "brand" son assets estáticos públicos (logo) que deben verse también en
  // /login, sin sesión — si no, el redirect de arriba los intercepta como
  // si fueran una página protegida y la imagen nunca carga.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brand).*)"],
};
