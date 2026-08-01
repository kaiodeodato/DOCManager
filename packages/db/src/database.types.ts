/**
 * Placeholder Database types for DOC Manager.
 *
 * Regenerate from a live/local schema with:
 *   npm run db:types
 *
 * Do not hand-edit the generated file once the CLI output replaces this stub —
 * keep this shape as a fallback until E1 migrations are applied and types are generated.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orgs: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      org_members: {
        Row: {
          id: string;
          org_id: string;
          user_id: string;
          role: "owner" | "accountant" | "viewer";
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          user_id: string;
          role: "owner" | "accountant" | "viewer";
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          user_id?: string;
          role?: "owner" | "accountant" | "viewer";
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          org_id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          status: string;
          document_type: string | null;
          cost_center: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          status?: string;
          document_type?: string | null;
          cost_center?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          storage_path?: string;
          original_filename?: string;
          mime_type?: string;
          status?: string;
          document_type?: string | null;
          cost_center?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_jobs: {
        Row: {
          id: string;
          org_id: string;
          document_id: string | null;
          type: string;
          status: string;
          payload: Json;
          attempts: number;
          last_error: string | null;
          locked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          document_id?: string | null;
          type: string;
          status?: string;
          payload?: Json;
          attempts?: number;
          last_error?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          document_id?: string | null;
          type?: string;
          status?: string;
          payload?: Json;
          attempts?: number;
          last_error?: string | null;
          locked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_extractions: {
        Row: {
          id: string;
          org_id: string;
          document_id: string;
          job_id: string | null;
          raw_text: string | null;
          result: Json;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          document_id: string;
          job_id?: string | null;
          raw_text?: string | null;
          result?: Json;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          document_id?: string;
          job_id?: string | null;
          raw_text?: string | null;
          result?: Json;
          confidence?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      document_extractions_corrections: {
        Row: {
          id: string;
          org_id: string;
          document_id: string;
          extraction_id: string | null;
          corrected_by: string | null;
          original: Json;
          corrected: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          document_id: string;
          extraction_id?: string | null;
          corrected_by?: string | null;
          original?: Json;
          corrected?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          document_id?: string;
          extraction_id?: string | null;
          corrected_by?: string | null;
          original?: Json;
          corrected?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      document_tags: {
        Row: {
          id: string;
          org_id: string;
          document_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          document_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          document_id?: string;
          tag?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          org_id: string | null;
          actor_id: string | null;
          table_name: string;
          record_id: string | null;
          action: string;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          actor_id?: string | null;
          table_name: string;
          record_id?: string | null;
          action: string;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string | null;
          actor_id?: string | null;
          table_name?: string;
          record_id?: string | null;
          action?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tenant_taxonomy_config: {
        Row: {
          org_id: string;
          config: Json;
          updated_at: string;
        };
        Insert: {
          org_id: string;
          config?: Json;
          updated_at?: string;
        };
        Update: {
          org_id?: string;
          config?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_org_ids: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
