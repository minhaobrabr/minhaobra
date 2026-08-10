"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { resumoObra, type ResumoObra } from "@/lib/aggregations";
import { precisaDeAutenticacao } from "@/lib/protected-routes";
import { createClient } from "@/lib/supabase/client";
import {
  toAporte,
  toBillingEntry,
  toDespesa,
  toObra,
  toPrestador,
  toRecurso,
  toSubscription,
  toUsuario,
} from "@/lib/supabase/mappers";
import type { TablesUpdate } from "@/lib/supabase/database.types";
import { FullPageLoading } from "@/components/shared/full-page-loading";
import type {
  Aporte,
  BillingEntry,
  Despesa,
  Obra,
  Prestador,
  Recurso,
  Subscription,
  Usuario,
} from "@/types";

const OBRA_VAZIA: Obra = { id: "", nome: "" };
const USUARIO_VAZIO: Usuario = { nome: "", email: "", criadoEm: "" };
const ASSINATURA_VAZIA: Subscription = {
  status: "trial",
  trialStartedAt: "",
  trialEndsAt: "",
  planName: "ObraControl Pro",
  planPrice: 19.9,
  nextBillingAt: null,
  paymentMethod: null,
};

interface ObraStore {
  /** Verdadeiro só durante a busca inicial dos dados no Supabase, logo após o login. */
  carregando: boolean;
  obra: Obra;
  usuario: Usuario;
  recursos: Recurso[];
  despesas: Despesa[];
  prestadores: Prestador[];
  subscription: Subscription;
  billingHistory: BillingEntry[];
  resumo: ResumoObra;
  /** Só usado no onboarding — cria a obra inicial do usuário. */
  criarObra: (dados: Omit<Obra, "id">) => Promise<void>;
  atualizarObra: (dados: Partial<Omit<Obra, "id">>) => Promise<void>;
  atualizarUsuario: (dados: Usuario) => Promise<void>;
  criarRecurso: (dados: Omit<Recurso, "id" | "aportes">) => Promise<void>;
  atualizarRecurso: (id: string, dados: Omit<Recurso, "id" | "aportes">) => Promise<void>;
  removerRecurso: (id: string) => Promise<void>;
  registrarAporte: (recursoId: string, dados: Omit<Aporte, "id">) => Promise<void>;
  criarDespesa: (dados: Omit<Despesa, "id">) => Promise<void>;
  atualizarDespesa: (id: string, dados: Omit<Despesa, "id">) => Promise<void>;
  removerDespesa: (id: string) => Promise<void>;
  criarPrestador: (dados: Omit<Prestador, "id">) => Promise<void>;
  atualizarPrestador: (id: string, dados: Omit<Prestador, "id">) => Promise<void>;
  removerPrestador: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const ObraContext = React.createContext<ObraStore | null>(null);

export function ObraProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [carregando, setCarregando] = React.useState(true);
  const [obra, setObra] = React.useState<Obra>(OBRA_VAZIA);
  const [usuario, setUsuario] = React.useState<Usuario>(USUARIO_VAZIO);
  const [recursos, setRecursos] = React.useState<Recurso[]>([]);
  const [despesas, setDespesas] = React.useState<Despesa[]>([]);
  const [prestadores, setPrestadores] = React.useState<Prestador[]>([]);
  const [subscription, setSubscription] = React.useState<Subscription>(ASSINATURA_VAZIA);
  const [billingHistory, setBillingHistory] = React.useState<BillingEntry[]>([]);

  // Busca tudo de uma vez no primeiro mount — só existe sessão para buscar em rotas
  // protegidas; nas páginas de marketing/login isso resolve rápido e não bloqueia nada.
  React.useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelado) setCarregando(false);
        return;
      }

      const [perfilRes, assinaturaRes, cobrancasRes, obraRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        supabase
          .from("billing_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("data", { ascending: false }),
        supabase.from("obras").select("*").eq("user_id", user.id).limit(1).maybeSingle(),
      ]);

      if (cancelado) return;

      if (perfilRes.data) setUsuario(toUsuario(perfilRes.data));
      if (assinaturaRes.data) setSubscription(toSubscription(assinaturaRes.data));
      if (cobrancasRes.data) setBillingHistory(cobrancasRes.data.map(toBillingEntry));

      if (obraRes.data) {
        setObra(toObra(obraRes.data));

        const [recursosRes, prestadoresRes, despesasRes] = await Promise.all([
          supabase
            .from("recursos")
            .select("*, aportes(*)")
            .eq("obra_id", obraRes.data.id)
            .order("created_at"),
          supabase
            .from("prestadores")
            .select("*")
            .eq("obra_id", obraRes.data.id)
            .order("created_at"),
          supabase
            .from("despesas")
            .select("*")
            .eq("obra_id", obraRes.data.id)
            .order("data", { ascending: false }),
        ]);

        if (cancelado) return;

        if (recursosRes.data) {
          setRecursos(recursosRes.data.map((row) => toRecurso(row, row.aportes ?? [])));
        }
        if (prestadoresRes.data) setPrestadores(prestadoresRes.data.map(toPrestador));
        if (despesasRes.data) setDespesas(despesasRes.data.map(toDespesa));
      }

      setCarregando(false);
    }

    carregar();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const criarObra = React.useCallback(async (dados: Omit<Obra, "id">) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Sem sessão ativa.");

    const { data, error } = await supabase
      .from("obras")
      .insert({
        user_id: user.id,
        nome: dados.nome,
        endereco: dados.endereco ?? null,
        inicio: dados.inicio ?? null,
        previsao_termino: dados.previsaoTermino ?? null,
        tipo: dados.tipo ?? null,
        orcamento_planejado: dados.orcamentoPlanejado ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    setObra(toObra(data));
  }, []);

  const atualizarObra = React.useCallback(
    async (dados: Partial<Omit<Obra, "id">>) => {
      const supabase = createClient();
      const payload: TablesUpdate<"obras"> = {};
      if (dados.nome !== undefined) payload.nome = dados.nome;
      if (dados.endereco !== undefined) payload.endereco = dados.endereco;
      if (dados.inicio !== undefined) payload.inicio = dados.inicio;
      if (dados.previsaoTermino !== undefined) payload.previsao_termino = dados.previsaoTermino;
      if (dados.tipo !== undefined) payload.tipo = dados.tipo;
      if (dados.orcamentoPlanejado !== undefined) {
        payload.orcamento_planejado = dados.orcamentoPlanejado;
      }

      const { error } = await supabase.from("obras").update(payload).eq("id", obra.id);
      if (error) throw error;
      setObra((atual) => ({ ...atual, ...dados }));
    },
    [obra.id],
  );

  const atualizarUsuario = React.useCallback(async (dados: Usuario) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Sem sessão ativa.");

    // E-mail vem do Google e não é editável aqui — só nome e cidade são gerenciados pelo app.
    const { error } = await supabase
      .from("profiles")
      .update({ nome: dados.nome, cidade: dados.cidade ?? null })
      .eq("id", user.id);
    if (error) throw error;
    setUsuario((atual) => ({ ...atual, nome: dados.nome, cidade: dados.cidade }));
  }, []);

  const criarRecurso = React.useCallback(
    async (dados: Omit<Recurso, "id" | "aportes">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("recursos")
        .insert({
          obra_id: obra.id,
          nome: dados.nome,
          tipo: dados.tipo,
          descricao: dados.descricao ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      setRecursos((atual) => [...atual, toRecurso(data, [])]);
    },
    [obra.id],
  );

  const atualizarRecurso = React.useCallback(
    async (id: string, dados: Omit<Recurso, "id" | "aportes">) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("recursos")
        .update({ nome: dados.nome, tipo: dados.tipo, descricao: dados.descricao ?? null })
        .eq("id", id);
      if (error) throw error;
      setRecursos((atual) => atual.map((r) => (r.id === id ? { ...r, ...dados } : r)));
    },
    [],
  );

  const removerRecurso = React.useCallback(async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("recursos").delete().eq("id", id);
    if (error) throw error;
    setRecursos((atual) => atual.filter((r) => r.id !== id));
  }, []);

  const registrarAporte = React.useCallback(
    async (recursoId: string, dados: Omit<Aporte, "id">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("aportes")
        .insert({
          recurso_id: recursoId,
          data: dados.data,
          valor: dados.valor,
          observacao: dados.observacao ?? null,
        })
        .select()
        .single();
      if (error) throw error;

      const novoAporte = toAporte(data);
      setRecursos((atual) =>
        atual.map((r) =>
          r.id === recursoId
            ? {
                ...r,
                aportes: [...r.aportes, novoAporte].sort((a, b) => a.data.localeCompare(b.data)),
              }
            : r,
        ),
      );
    },
    [],
  );

  const criarDespesa = React.useCallback(
    async (dados: Omit<Despesa, "id">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("despesas")
        .insert({
          obra_id: obra.id,
          descricao: dados.descricao,
          categoria: dados.categoria,
          valor: dados.valor,
          data: dados.data,
          fornecedor: dados.fornecedor ?? null,
          prestador_id: dados.prestadorId ?? null,
          nota_fiscal: dados.notaFiscal ?? null,
          etapa: dados.etapa ?? null,
          observacoes: dados.observacoes ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      setDespesas((atual) => [...atual, toDespesa(data)]);
    },
    [obra.id],
  );

  const atualizarDespesa = React.useCallback(async (id: string, dados: Omit<Despesa, "id">) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("despesas")
      .update({
        descricao: dados.descricao,
        categoria: dados.categoria,
        valor: dados.valor,
        data: dados.data,
        fornecedor: dados.fornecedor ?? null,
        prestador_id: dados.prestadorId ?? null,
        nota_fiscal: dados.notaFiscal ?? null,
        etapa: dados.etapa ?? null,
        observacoes: dados.observacoes ?? null,
      })
      .eq("id", id);
    if (error) throw error;
    setDespesas((atual) => atual.map((d) => (d.id === id ? { ...dados, id } : d)));
  }, []);

  const removerDespesa = React.useCallback(async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("despesas").delete().eq("id", id);
    if (error) throw error;
    setDespesas((atual) => atual.filter((d) => d.id !== id));
  }, []);

  const criarPrestador = React.useCallback(
    async (dados: Omit<Prestador, "id">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("prestadores")
        .insert({
          obra_id: obra.id,
          nome: dados.nome,
          categoria: dados.categoria,
          valor_contratado: dados.valorContratado ?? null,
          observacoes: dados.observacoes ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      setPrestadores((atual) => [...atual, toPrestador(data)]);
    },
    [obra.id],
  );

  const atualizarPrestador = React.useCallback(
    async (id: string, dados: Omit<Prestador, "id">) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("prestadores")
        .update({
          nome: dados.nome,
          categoria: dados.categoria,
          valor_contratado: dados.valorContratado ?? null,
          observacoes: dados.observacoes ?? null,
        })
        .eq("id", id);
      if (error) throw error;
      setPrestadores((atual) => atual.map((p) => (p.id === id ? { ...p, ...dados } : p)));
    },
    [],
  );

  const removerPrestador = React.useCallback(async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("prestadores").delete().eq("id", id);
    if (error) throw error;
    // O banco já solta o vínculo (ON DELETE SET NULL) — só refletimos isso localmente.
    setDespesas((atual) =>
      atual.map((d) => (d.prestadorId === id ? { ...d, prestadorId: undefined } : d)),
    );
    setPrestadores((atual) => atual.filter((p) => p.id !== id));
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Navegação dura, não router.push: garante que todo estado do provider é descartado.
    window.location.href = "/login";
  }, []);

  const value = React.useMemo<ObraStore>(
    () => ({
      carregando,
      obra,
      usuario,
      recursos,
      despesas,
      prestadores,
      subscription,
      billingHistory,
      resumo: resumoObra(obra.orcamentoPlanejado ?? 0, recursos, despesas),
      criarObra,
      atualizarObra,
      atualizarUsuario,
      criarRecurso,
      atualizarRecurso,
      removerRecurso,
      registrarAporte,
      criarDespesa,
      atualizarDespesa,
      removerDespesa,
      criarPrestador,
      atualizarPrestador,
      removerPrestador,
      signOut,
    }),
    [
      carregando,
      obra,
      usuario,
      recursos,
      despesas,
      prestadores,
      subscription,
      billingHistory,
      criarObra,
      atualizarObra,
      atualizarUsuario,
      criarRecurso,
      atualizarRecurso,
      removerRecurso,
      registrarAporte,
      criarDespesa,
      atualizarDespesa,
      removerDespesa,
      criarPrestador,
      atualizarPrestador,
      removerPrestador,
      signOut,
    ],
  );

  // Só bloqueia a renderização em rotas que realmente precisam dos dados prontos —
  // a landing e as telas de auth nunca esperam por isso.
  if (carregando && precisaDeAutenticacao(pathname)) {
    return <FullPageLoading />;
  }

  return <ObraContext.Provider value={value}>{children}</ObraContext.Provider>;
}

export function useObra(): ObraStore {
  const context = React.useContext(ObraContext);
  if (!context) {
    throw new Error("useObra precisa estar dentro de <ObraProvider>.");
  }
  return context;
}
