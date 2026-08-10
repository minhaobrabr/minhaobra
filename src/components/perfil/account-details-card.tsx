"use client";

import * as React from "react";
import { GoogleLogo, Warning } from "@phosphor-icons/react/dist/ssr";

import { useObra } from "@/components/providers/obra-store";
import { Field } from "@/components/shared/field";
import { toast } from "@/components/shared/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters";

export function AccountDetailsCard() {
  const { usuario, atualizarUsuario } = useObra();

  const [nome, setNome] = React.useState(usuario.nome);
  const [cidade, setCidade] = React.useState(usuario.cidade ?? "");
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  const alterado = nome.trim() !== usuario.nome || cidade.trim() !== (usuario.cidade ?? "");

  async function handleSalvar() {
    setErro(null);
    setSalvando(true);
    try {
      await atualizarUsuario({ ...usuario, nome: nome.trim(), cidade: cidade.trim() || undefined });
      toast({ title: "Dados da conta atualizados." });
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-1 p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xl font-semibold text-accent-text">
          {usuario.nome.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-medium text-ink">{usuario.nome}</p>
          <p className="truncate text-sm text-ink-muted">{usuario.email}</p>
          <p className="mt-0.5 text-xs text-ink-faint">Conta criada em {formatDate(usuario.criadoEm)}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-xs text-ink-muted">
        <GoogleLogo size={14} className="shrink-0 text-ink-faint" />
        Conectado com o Google. Seu e-mail é gerenciado pela sua conta.
      </div>

      <div className="mt-4 space-y-4">
        <Field id="perfil-nome" label="Nome completo">
          <Input id="perfil-nome" value={nome} onChange={(event) => setNome(event.target.value)} />
        </Field>

        <Field id="perfil-cidade" label="Cidade" hint="opcional">
          <Input
            id="perfil-cidade"
            placeholder="Ex: São Paulo, SP"
            value={cidade}
            onChange={(event) => setCidade(event.target.value)}
          />
        </Field>

        {erro ? (
          <p className="flex items-center gap-1.5 text-xs text-danger">
            <Warning size={12} weight="fill" />
            {erro}
          </p>
        ) : null}

        {alterado ? (
          <Button
            variant="outline"
            className="w-full"
            loading={salvando}
            loadingLabel="Salvando"
            onClick={handleSalvar}
          >
            Salvar alterações
          </Button>
        ) : null}
      </div>
    </div>
  );
}
