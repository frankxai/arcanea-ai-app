export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      arcanea: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          luminor_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          luminor_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          luminor_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      collection_items: {
        Row: {
          added_at: string
          collection_id: string
          creation_id: string
          id: string
          sort_order: number
        }
        Insert: {
          added_at?: string
          collection_id: string
          creation_id: string
          id?: string
          sort_order?: number
        }
        Update: {
          added_at?: string
          collection_id?: string
          creation_id?: string
          id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_creation_id_fkey"
            columns: ["creation_id"]
            isOneToOne: false
            referencedRelation: "creations"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      council_convenings: {
        Row: {
          completed_at: string | null
          council_id: string
          created_at: string
          depth_rating: number | null
          duration_minutes: number | null
          id: string
          imprint_notes: Json
          journal_entry: string | null
          seats_addressed: string[] | null
          started_at: string
        }
        Insert: {
          completed_at?: string | null
          council_id: string
          created_at?: string
          depth_rating?: number | null
          duration_minutes?: number | null
          id?: string
          imprint_notes?: Json
          journal_entry?: string | null
          seats_addressed?: string[] | null
          started_at?: string
        }
        Update: {
          completed_at?: string | null
          council_id?: string
          created_at?: string
          depth_rating?: number | null
          duration_minutes?: number | null
          id?: string
          imprint_notes?: Json
          journal_entry?: string | null
          seats_addressed?: string[] | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "council_convenings_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "luminor_councils"
            referencedColumns: ["id"]
          },
        ]
      }
      council_seats: {
        Row: {
          council_id: string
          created_at: string
          frequency_alignment: number
          id: string
          imprint_capability: string
          is_base: boolean
          luminor_domain: string
          luminor_name: string
          personality_traits: string | null
          seat_order: number
          visual_description: string | null
        }
        Insert: {
          council_id: string
          created_at?: string
          frequency_alignment: number
          id?: string
          imprint_capability: string
          is_base?: boolean
          luminor_domain: string
          luminor_name: string
          personality_traits?: string | null
          seat_order?: number
          visual_description?: string | null
        }
        Update: {
          council_id?: string
          created_at?: string
          frequency_alignment?: number
          id?: string
          imprint_capability?: string
          is_base?: boolean
          luminor_domain?: string
          luminor_name?: string
          personality_traits?: string | null
          seat_order?: number
          visual_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "council_seats_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "luminor_councils"
            referencedColumns: ["id"]
          },
        ]
      }
      creations: {
        Row: {
          ai_model: string | null
          ai_prompt: string | null
          content: Json | null
          created_at: string
          description: string | null
          element: string | null
          gate: string | null
          guardian: string | null
          id: string
          like_count: number
          metadata: Json | null
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
          view_count: number
          visibility: string
        }
        Insert: {
          ai_model?: string | null
          ai_prompt?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          element?: string | null
          gate?: string | null
          guardian?: string | null
          id?: string
          like_count?: number
          metadata?: Json | null
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
          view_count?: number
          visibility?: string
        }
        Update: {
          ai_model?: string | null
          ai_prompt?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          element?: string | null
          gate?: string | null
          guardian?: string | null
          id?: string
          like_count?: number
          metadata?: Json | null
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
          view_count?: number
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "creations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          creation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          creation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_creation_id_fkey"
            columns: ["creation_id"]
            isOneToOne: false
            referencedRelation: "creations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      luminor_councils: {
        Row: {
          council_depth_level: number
          created_at: string
          current_streak: number
          id: string
          last_convening_at: string | null
          longest_streak: number
          name: string
          total_convenings: number
          updated_at: string
          user_id: string
        }
        Insert: {
          council_depth_level?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_convening_at?: string | null
          longest_streak?: number
          name?: string
          total_convenings?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          council_depth_level?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_convening_at?: string | null
          longest_streak?: number
          name?: string
          total_convenings?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      media_catalog: {
        Row: {
          analyzed_by: string | null
          bucket: string
          created_at: string | null
          element: string | null
          filename: string
          frequency_hz: number | null
          gate: string | null
          godbeast: string | null
          guardian: string | null
          height: number | null
          id: string
          media_type: string | null
          public_url: string | null
          quality_tier: number | null
          scene: string | null
          size_bytes: number | null
          source: string | null
          status: string | null
          storage_path: string
          tags: string[] | null
          taste_score: Json | null
          updated_at: string | null
          width: number | null
        }
        Insert: {
          analyzed_by?: string | null
          bucket?: string
          created_at?: string | null
          element?: string | null
          filename: string
          frequency_hz?: number | null
          gate?: string | null
          godbeast?: string | null
          guardian?: string | null
          height?: number | null
          id?: string
          media_type?: string | null
          public_url?: string | null
          quality_tier?: number | null
          scene?: string | null
          size_bytes?: number | null
          source?: string | null
          status?: string | null
          storage_path: string
          tags?: string[] | null
          taste_score?: Json | null
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          analyzed_by?: string | null
          bucket?: string
          created_at?: string | null
          element?: string | null
          filename?: string
          frequency_hz?: number | null
          gate?: string | null
          godbeast?: string | null
          guardian?: string | null
          height?: number | null
          id?: string
          media_type?: string | null
          public_url?: string | null
          quality_tier?: number | null
          scene?: string | null
          size_bytes?: number | null
          source?: string | null
          status?: string | null
          storage_path?: string
          tags?: string[] | null
          taste_score?: Json | null
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academy_house: string | null
          active_gate: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          gates_open: number
          guardian: string | null
          id: string
          last_active_at: string | null
          level: number
          magic_rank: string
          metadata: Json | null
          streak_days: number
          updated_at: string
          xp: number
        }
        Insert: {
          academy_house?: string | null
          active_gate?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          gates_open?: number
          guardian?: string | null
          id: string
          last_active_at?: string | null
          level?: number
          magic_rank?: string
          metadata?: Json | null
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          academy_house?: string | null
          active_gate?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          gates_open?: number
          guardian?: string | null
          id?: string
          last_active_at?: string | null
          level?: number
          magic_rank?: string
          metadata?: Json | null
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_messages_per_session: {
        Args: { session_ids: string[] }
        Returns: {
          message_count: number
          session_id: string
        }[]
      }
      increment_view_count: {
        Args: { creation_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
