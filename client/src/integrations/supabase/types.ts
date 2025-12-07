export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          cpf: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      processes: {
        Row: {
          id: string;
          process_number: string;
          title: string;
          description: string | null;
          status: string;
          progress: number | null;
          client_id: string;
          process_type_id: string;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['processes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['processes']['Insert']>;
      };
      process_steps: {
        Row: {
          id: string;
          process_id: string;
          title: string;
          description: string | null;
          order_number: number;
          status: string;
          deadline: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_steps']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['process_steps']['Insert']>;
      };
      process_messages: {
        Row: {
          id: string;
          process_id: string;
          sender_id: string;
          message: string;
          message_type: string | null;
          attachment_url: string | null;
          attachment_name: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['process_messages']['Insert']>;
      };
      process_documents: {
        Row: {
          id: string;
          process_id: string;
          name: string;
          file_url: string;
          file_type: string | null;
          file_size: number | null;
          status: string;
          uploaded_by: string;
          reviewed_by: string | null;
          review_notes: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_documents']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['process_documents']['Insert']>;
      };
      process_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          estimated_duration_days: number | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_types']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['process_types']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          process_id: string | null;
          title: string;
          message: string;
          type: string;
          priority: string | null;
          is_read: boolean | null;
          action_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string | null;
          target_name: string | null;
          details: Record<string, unknown> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      document_audit_logs: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          action: string;
          previous_status: string | null;
          new_status: string;
          observation: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['document_audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['document_audit_logs']['Insert']>;
      };
      process_feedback: {
        Row: {
          id: string;
          process_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_feedback']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['process_feedback']['Insert']>;
      };
      process_counter: {
        Row: {
          id: string;
          year_month: string;
          counter: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['process_counter']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['process_counter']['Insert']>;
      };
      cms_contents: {
        Row: {
          id: string;
          tipo: string;
          titulo: string;
          conteudo: string;
          data_ultima_edicao: string;
          editor: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cms_contents']['Row'], 'id' | 'created_at' | 'data_ultima_edicao'>;
        Update: Partial<Database['public']['Tables']['cms_contents']['Insert']>;
      };
      system_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['system_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['system_settings']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
