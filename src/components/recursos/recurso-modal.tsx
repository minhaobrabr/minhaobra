"use client";

import * as React from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";

import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RECURSO_TIPOS, RECURSO_TIPO_META } from "@/lib/domain";
import type { Recurso, RecursoTipo } from "@/types";

type DadosRecurso = Omit<Recurso, "id" | "aportes">;

interface RecursoModalProps {
  /** Omitido quando o modal é controlado por fora (ex.: item de menu). */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preenchido quando o modal está editando uma fonte existente. */
  recurso?: Recurso;
  onSubmit: (dados: DadosRecurso) => void | Promise<void>;
}

const VAZIO: DadosRecurso = { nome: "", tipo: "PROPRIO", descricao: "" };

export function RecursoModal({
  trigger,
  open,
  onOpenChange,
  recurso,
  onSubmit,
}: RecursoModalProps) {
  const [openInterno, setOpenInterno] = React.useState(false);
  const [dados, setDados] = React.useState<DadosRecurso>(VAZIO);
  const [erros, setErros] = React.useState<Record<string, string>>({});
  const [salvando, setSalvando] = React.useState(false);
  const [erroEnvio, setErroEnvio] = React.useState<string | null>(null);

  const aberto = open ?? openInterno;
  const setAberto = onOpenChange ?? setOpenInterno;

  React.useEffect(() => {
    if (!aberto) return;
    setDados(
      recurso
        ? {
            nome: recurso.nome,
            tipo: recurso.tipo,
            descricao: recurso.descricao ?? "",
          }
        : VAZIO,
    );
    setErros({});
    setErroEnvio(null);
  }, [aberto, recurso]);

  function validar(): boolean {
    const proximos: Record<string, string> = {};
    if (!dados.nome.trim()) proximos.nome = "Informe um nome para a fonte de recurso.";
    setErros(proximos);
    return Object.keys(proximos).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validar()) return;

    setErroEnvio(null);
    setSalvando(true);
    try {
      await onSubmit({
        ...dados,
        nome: dados.nome.trim(),
        descricao: dados.descricao?.trim() || undefined,
      });
      setAberto(false);
    } catch {
      setErroEnvio("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{recurso ? "Editar recurso" : "Adicionar recurso"}</DialogTitle>
          <DialogDescription>
            Cadastre de onde vem o dinheiro da obra. Os aportes são lançados depois, um a um.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field id="recurso-nome" label="Nome do recurso" required error={erros.nome}>
            <Input
              id="recurso-nome"
              value={dados.nome}
              onChange={(event) => setDados({ ...dados, nome: event.target.value })}
              aria-invalid={Boolean(erros.nome)}
              autoFocus
            />
          </Field>

          <Field id="recurso-tipo" label="Tipo" required>
            <Select
              value={dados.tipo}
              onValueChange={(valor) => setDados({ ...dados, tipo: valor as RecursoTipo })}
            >
              <SelectTrigger id="recurso-tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURSO_TIPOS.map((tipo) => {
                  const meta = RECURSO_TIPO_META[tipo];
                  return (
                    <SelectItem key={tipo} value={tipo}>
                      <span className="flex items-center gap-2">
                        <meta.icon size={15} />
                        {meta.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </Field>

          <Field id="recurso-descricao" label="Observação" hint="opcional">
            <Textarea
              id="recurso-descricao"
              value={dados.descricao ?? ""}
              onChange={(event) => setDados({ ...dados, descricao: event.target.value })}
              maxLength={280}
            />
          </Field>

          {erroEnvio ? (
            <p className="flex items-center gap-1.5 text-xs text-danger">
              <Warning size={12} weight="fill" />
              {erroEnvio}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando} loadingLabel="Salvando">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
