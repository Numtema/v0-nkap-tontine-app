export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          country: string
          avatar_url: string | null
          nkap_balance: number
          reputation_score: number
          is_verified: boolean
          pin_hash: string | null
          biometric_enabled: boolean
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          country?: string
          avatar_url?: string | null
          nkap_balance?: number
          reputation_score?: number
          is_verified?: boolean
          pin_hash?: string | null
          biometric_enabled?: boolean
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          country?: string
          avatar_url?: string | null
          nkap_balance?: number
          reputation_score?: number
          is_verified?: boolean
          pin_hash?: string | null
          biometric_enabled?: boolean
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      tontines: {
        Row: {
          id: string
          name: string
          description: string | null
          slogan: string | null
          country: string
          contribution_amount: number
          frequency: string
          membership_fee: number
          late_penalty_percent: number
          min_members: number
          max_members: number
          current_cycle: number
          status: string
          invite_code: string | null
          is_public: boolean
          rules: Json | null
          created_by: string | null
          president_id: string | null
          secretary_id: string | null
          treasurer_id: string | null
          cycle_start_date: string | null
          next_session_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slogan?: string | null
          country?: string
          contribution_amount: number
          frequency: string
          membership_fee?: number
          late_penalty_percent?: number
          min_members?: number
          max_members?: number
          current_cycle?: number
          status?: string
          invite_code?: string | null
          is_public?: boolean
          rules?: Json | null
          created_by?: string | null
          president_id?: string | null
          secretary_id?: string | null
          treasurer_id?: string | null
          cycle_start_date?: string | null
          next_session_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slogan?: string | null
          country?: string
          contribution_amount?: number
          frequency?: string
          membership_fee?: number
          late_penalty_percent?: number
          min_members?: number
          max_members?: number
          current_cycle?: number
          status?: string
          invite_code?: string | null
          is_public?: boolean
          rules?: Json | null
          created_by?: string | null
          president_id?: string | null
          secretary_id?: string | null
          treasurer_id?: string | null
          cycle_start_date?: string | null
          next_session_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tontine_members: {
        Row: {
          id: string
          tontine_id: string
          user_id: string
          role: string
          order_number: number | null
          status: string
          total_contributed: number
          total_received: number
          has_received_this_cycle: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          user_id: string
          role?: string
          order_number?: number | null
          status?: string
          total_contributed?: number
          total_received?: number
          has_received_this_cycle?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          user_id?: string
          role?: string
          order_number?: number | null
          status?: string
          total_contributed?: number
          total_received?: number
          has_received_this_cycle?: boolean
          joined_at?: string
        }
      }
      caisses: {
        Row: {
          id: string
          tontine_id: string
          name: string
          type: string
          description: string | null
          contribution_amount: number
          balance: number
          is_mandatory: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          name: string
          type?: string
          description?: string | null
          contribution_amount?: number
          balance?: number
          is_mandatory?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          name?: string
          type?: string
          description?: string | null
          contribution_amount?: number
          balance?: number
          is_mandatory?: boolean
          created_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          tontine_id: string
          caisse_id: string
          user_id: string
          amount: number
          cycle_number: number | null
          session_number: number | null
          payment_method: string | null
          status: string
          transaction_ref: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          caisse_id: string
          user_id: string
          amount: number
          cycle_number?: number | null
          session_number?: number | null
          payment_method?: string | null
          status?: string
          transaction_ref?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          caisse_id?: string
          user_id?: string
          amount?: number
          cycle_number?: number | null
          session_number?: number | null
          payment_method?: string | null
          status?: string
          transaction_ref?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          fee: number
          currency: string
          local_currency: string | null
          local_amount: number | null
          exchange_rate: number | null
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          status: string
          external_ref: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          fee?: number
          currency?: string
          local_currency?: string | null
          local_amount?: number | null
          exchange_rate?: number | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          external_ref?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          fee?: number
          currency?: string
          local_currency?: string | null
          local_amount?: number | null
          exchange_rate?: number | null
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          external_ref?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      penalties: {
        Row: {
          id: string
          tontine_id: string
          user_id: string
          type: string
          amount: number
          reason: string | null
          session_number: number | null
          status: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          user_id: string
          type: string
          amount: number
          reason?: string | null
          session_number?: number | null
          status?: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          user_id?: string
          type?: string
          amount?: number
          reason?: string | null
          session_number?: number | null
          status?: string
          paid_at?: string | null
          created_at?: string
        }
      }
      elections: {
        Row: {
          id: string
          tontine_id: string
          position: string
          status: string
          winner_id: string | null
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          tontine_id: string
          position: string
          status?: string
          winner_id?: string | null
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          tontine_id?: string
          position?: string
          status?: string
          winner_id?: string | null
          started_at?: string
          ended_at?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          election_id: string
          voter_id: string
          candidate_id: string
          created_at: string
        }
        Insert: {
          id?: string
          election_id: string
          voter_id: string
          candidate_id: string
          created_at?: string
        }
        Update: {
          id?: string
          election_id?: string
          voter_id?: string
          candidate_id?: string
          created_at?: string
        }
      }
      draws: {
        Row: {
          id: string
          tontine_id: string
          cycle_number: number
          status: string
          draw_order: Json | null
          confirmations: Json
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          cycle_number: number
          status?: string
          draw_order?: Json | null
          confirmations?: Json
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          cycle_number?: number
          status?: string
          draw_order?: Json | null
          confirmations?: Json
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          tontine_id: string | null
          sender_id: string
          receiver_id: string | null
          content: string
          type: string
          is_pinned: boolean
          read_by: Json
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id?: string | null
          sender_id: string
          receiver_id?: string | null
          content: string
          type?: string
          is_pinned?: boolean
          read_by?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string | null
          sender_id?: string
          receiver_id?: string | null
          content?: string
          type?: string
          is_pinned?: boolean
          read_by?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
      }
      join_requests: {
        Row: {
          id: string
          tontine_id: string
          user_id: string
          message: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tontine_id: string
          user_id: string
          message?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tontine_id?: string
          user_id?: string
          message?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          currency_code: string
          currency_name: string
          country: string
          rate_to_nkap: number
          updated_at: string
        }
        Insert: {
          id?: string
          currency_code: string
          currency_name: string
          country: string
          rate_to_nkap: number
          updated_at?: string
        }
        Update: {
          id?: string
          currency_code?: string
          currency_name?: string
          country?: string
          rate_to_nkap?: number
          updated_at?: string
        }
      }
    }
  }
}
