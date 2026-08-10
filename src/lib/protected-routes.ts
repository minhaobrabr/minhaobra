/** Rotas que exigem sessão autenticada — compartilhado entre o middleware e o ObraProvider. */
const ROTAS_APP = ["/dashboard", "/recursos", "/despesas", "/relatorio", "/perfil"];

export function precisaDeAutenticacao(pathname: string): boolean {
  return pathname === "/onboarding" || ROTAS_APP.some((rota) => pathname.startsWith(rota));
}
