/**
 * Gerado a partir do schema real do Supabase (`generate_typescript_types`).
 * Não editar à mão — regerar sempre que uma migração mudar o schema.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      aportes: {
        Row: {
          created_at: string
          data: string
          id: string
          observacao: string | null
          recurso_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data: string
          id?: string
          observacao?: string | null
          recurso_id: string
          valor: number
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          observacao?: string | null
          recurso_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "aportes_recurso_id_fkey"
            columns: ["recurso_id"]
            isOneToOne: false
            referencedRelation: "recursos"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_entries: {
        Row: {
          created_at: string
          data: string
          descricao: string
          id: string
          status: Database["public"]["Enums"]["cobranca_status"]
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data: string
          descricao: string
          id?: string
          status: Database["public"]["Enums"]["cobranca_status"]
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          status?: Database["public"]["Enums"]["cobranca_status"]
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      despesas: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at: string
          data: string
          descricao: string
          etapa: Database["public"]["Enums"]["etapa_obra"] | null
          fornecedor: string | null
          id: string
          nota_fiscal: string | null
          obra_id: string
          observacoes: string | null
          prestador_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string
          data: string
          descricao: string
          etapa?: Database["public"]["Enums"]["etapa_obra"] | null
          fornecedor?: string | null
          id?: string
          nota_fiscal?: string | null
          obra_id: string
          observacoes?: string | null
          prestador_id?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string
          data?: string
          descricao?: string
          etapa?: Database["public"]["Enums"]["etapa_obra"] | null
          fornecedor?: string | null
          id?: string
          nota_fiscal?: string | null
          obra_id?: string
          observacoes?: string | null
          prestador_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "despesas_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "despesas_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          created_at: string
          endereco: string | null
          id: string
          inicio: string | null
          nome: string
          orcamento_planejado: number | null
          previsao_termino: string | null
          tipo: Database["public"]["Enums"]["tipo_obra"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          id?: string
          inicio?: string | null
          nome: string
          orcamento_planejado?: number | null
          previsao_termino?: string | null
          tipo?: Database["public"]["Enums"]["tipo_obra"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          endereco?: string | null
          id?: string
          inicio?: string | null
          nome?: string
          orcamento_planejado?: number | null
          previsao_termino?: string | null
          tipo?: Database["public"]["Enums"]["tipo_obra"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prestadores: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at: string
          id: string
          nome: string
          obra_id: string
          observacoes: string | null
          updated_at: string
          valor_contratado: number | null
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string
          id?: string
          nome: string
          obra_id: string
          observacoes?: string | null
          updated_at?: string
          valor_contratado?: number | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string
          id?: string
          nome?: string
          obra_id?: string
          observacoes?: string | null
          updated_at?: string
          valor_contratado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prestadores_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cidade: string | null
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string
          email: string
          id: string
          nome: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      recursos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          obra_id: string
          tipo: Database["public"]["Enums"]["recurso_tipo"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          obra_id: string
          tipo: Database["public"]["Enums"]["recurso_tipo"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          obra_id?: string
          tipo?: Database["public"]["Enums"]["recurso_tipo"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recursos_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          next_billing_at: string | null
          payment_method: string | null
          plan_name: string
          plan_price: number
          status: Database["public"]["Enums"]["plan_status"]
          trial_ends_at: string
          trial_started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          next_billing_at?: string | null
          payment_method?: string | null
          plan_name?: string
          plan_price?: number
          status?: Database["public"]["Enums"]["plan_status"]
          trial_ends_at?: string
          trial_started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          next_billing_at?: string | null
          payment_method?: string | null
          plan_name?: string
          plan_price?: number
          status?: Database["public"]["Enums"]["plan_status"]
          trial_ends_at?: string
          trial_started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_obra: { Args: { check_obra_id: string }; Returns: boolean }
      user_owns_recurso: {
        Args: { check_recurso_id: string }
        Returns: boolean
      }
    }
    Enums: {
      categoria_despesa: "MATERIAL" | "MAO_DE_OBRA" | "SERVICO" | "OUTRO"
      cobranca_status: "PAGO" | "FALHOU"
      etapa_obra:
        | "FUNDACAO"
        | "ESTRUTURA"
        | "ALVENARIA"
        | "ACABAMENTO"
        | "OUTROS"
      plan_status: "trial" | "active" | "expired" | "canceled"
      recurso_tipo: "PROPRIO" | "FINANCIAMENTO" | "FGTS" | "SOCIO" | "OUTRO"
      tipo_obra:
        | "REFORMA_RESIDENCIAL"
        | "CONSTRUCAO"
        | "REFORMA_COMERCIAL"
        | "OUTRO"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_despesa: ["MATERIAL", "MAO_DE_OBRA", "SERVICO", "OUTRO"],
      cobranca_status: ["PAGO", "FALHOU"],
      etapa_obra: [
        "FUNDACAO",
        "ESTRUTURA",
        "ALVENARIA",
        "ACABAMENTO",
        "OUTROS",
      ],
      plan_status: ["trial", "active", "expired", "canceled"],
      recurso_tipo: ["PROPRIO", "FINANCIAMENTO", "FGTS", "SOCIO", "OUTRO"],
      tipo_obra: [
        "REFORMA_RESIDENCIAL",
        "CONSTRUCAO",
        "REFORMA_COMERCIAL",
        "OUTRO",
      ],
    },
  },
} as const
