import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * O Google redireciona pra cá depois do consentimento, com um `code` na URL.
 * Trocamos o code por uma sessão; o middleware cuida de mandar pro onboarding
 * ou pro dashboard dependendo se o usuário já tem obra cadastrada.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=autenticacao`);
}
