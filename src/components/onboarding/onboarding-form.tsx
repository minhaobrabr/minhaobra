"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Warning } from "@phosphor-icons/react/dist/ssr";

import { useObra } from "@/components/providers/obra-store";
import { TipoObraSegmented } from "@/components/onboarding/tipo-obra-segmented";
import { Field } from "@/components/shared/field";
import { MoneyInput } from "@/components/shared/money-input";
import { toast } from "@/components/shared/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TipoObra } from "@/types";

interface FormState {
  nome: string;
  tipo: TipoObra | null;
  orcamento: number;
  previsaoTermino: string;
}

const ESTADO_INICIAL: FormState = {
  nome: "",
  tipo: null,
  orcamento: 0,
  previsaoTermino: "",
};

export function OnboardingForm() {
  const router = useRouter();
  const { criarObra } = useObra();

  const [form, setForm] = React.useState<FormState>(ESTADO_INICIAL);
  const [tocados, setTocados] = React.useState<string[]>([]);
  const [salvando, setSalvando] = React.useState(false);
  const [erroEnvio, setErroEnvio] = React.useState<string | null>(null);

  // Só os 2 campos essenciais bloqueiam o envio — orçamento e data são de verdade opcionais.
  const erros = {
    nome: form.nome.trim() ? undefined : "Dê um nome para a obra.",
    tipo: form.tipo ? undefined : "Escolha o tipo de obra.",
  };
  const valido = Object.values(erros).every((erro) => erro === undefined);

  function marcarTocado(campo: string) {
    setTocados((atual) => (atual.includes(campo) ? atual : [...atual, campo]));
  }

  function erroDe(campo: keyof typeof erros): string | undefined {
    return tocados.includes(campo) ? erros[campo] : undefined;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTocados(["nome", "tipo"]);
    if (!valido || !form.tipo) return;

    setErroEnvio(null);
    setSalvando(true);

    try {
      await criarObra({
        nome: form.nome.trim(),
        tipo: form.tipo,
        // Campos opcionais: só entram no cadastro quando o usuário de fato os preencheu.
        ...(form.orcamento > 0 ? { orcamentoPlanejado: form.orcamento } : {}),
        ...(form.previsaoTermino ? { previsaoTermino: form.previsaoTermino } : {}),
      });

      toast({
        title: "Obra criada. Agora adicione suas fontes de recurso.",
        actionLabel: "Ir para Recursos",
        actionHref: "/recursos",
      });

      router.push("/dashboard");
    } catch {
      setErroEnvio("Não foi possível criar a obra agora. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id="obra-nome" label="Nome da obra" required error={erroDe("nome")}>
        <Input
          id="obra-nome"
          placeholder="Ex: Reforma apartamento Pinheiros"
          value={form.nome}
          onChange={(event) => setForm({ ...form, nome: event.target.value })}
          onBlur={() => marcarTocado("nome")}
          aria-invalid={Boolean(erroDe("nome"))}
          autoFocus
        />
      </Field>

      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wide text-ink-muted">
          Tipo de obra<span className="ml-0.5 text-accent-text">*</span>
        </p>
        <TipoObraSegmented
          value={form.tipo}
          onChange={(tipo) => setForm({ ...form, tipo })}
          invalid={Boolean(erroDe("tipo"))}
        />
        {erroDe("tipo") ? (
          <p className="flex items-center gap-1.5 text-xs text-danger">
            <Warning size={12} weight="fill" />
            {erros.tipo}
          </p>
        ) : null}
      </div>

      <Field
        id="obra-orcamento"
        label="Orçamento total planejado"
        hint="opcional"
      >
        <MoneyInput
          id="obra-orcamento"
          value={form.orcamento}
          onValueChange={(valor) => setForm({ ...form, orcamento: valor })}
        />
        <p className="mt-1.5 text-xs text-ink-faint">Você pode ajustar isso depois.</p>
      </Field>

      <Field id="obra-previsao" label="Data prevista de término" hint="opcional">
        <Input
          id="obra-previsao"
          type="date"
          className="font-mono"
          value={form.previsaoTermino}
          onChange={(event) => setForm({ ...form, previsaoTermino: event.target.value })}
        />
      </Field>

      <div>
        <Button type="submit" className="w-full" loading={salvando} loadingLabel="Criando obra">
          Criar minha obra
        </Button>
        {erroEnvio ? (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-danger">
            <Warning size={12} weight="fill" />
            {erroEnvio}
          </p>
        ) : (
          <p className="mt-3 text-center text-xs text-ink-faint">
            Você pode adicionar endereço, fotos e mais detalhes no perfil da obra depois.
          </p>
        )}
      </div>
    </form>
  );
}
