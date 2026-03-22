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
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_snapshots: {
        Row: {
          created_at: string
          id: string
          new_creations_7d: number | null
          new_users_7d: number | null
          snapshot_date: string
          total_chat_sessions: number | null
          total_creations: number | null
          total_likes: number | null
          total_luminors: number | null
          total_messages: number | null
          total_users: number | null
          total_views: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          new_creations_7d?: number | null
          new_users_7d?: number | null
          snapshot_date?: string
          total_chat_sessions?: number | null
          total_creations?: number | null
          total_likes?: number | null
          total_luminors?: number | null
          total_messages?: number | null
          total_users?: number | null
          total_views?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          new_creations_7d?: number | null
          new_users_7d?: number | null
          snapshot_date?: string
          total_chat_sessions?: number | null
          total_creations?: number | null
          total_likes?: number | null
          total_luminors?: number | null
          total_messages?: number | null
          total_users?: number | null
          total_views?: number | null
        }
        Relationships: []
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
      chat_conversations: {
        Row: {
          created_at: string
          focus_mode: string | null
          id: string
          luminor_id: string | null
          message_count: number
          messages: Json
          model_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          focus_mode?: string | null
          id?: string
          luminor_id?: string | null
          message_count?: number
          messages?: Json
          model_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          focus_mode?: string | null
          id?: string
          luminor_id?: string | null
          message_count?: number
          messages?: Json
          model_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_luminor_id_fkey"
            columns: ["luminor_id"]
            isOneToOne: false
            referencedRelation: "luminors"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          search_vector: unknown
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          search_vector?: unknown
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          search_vector?: unknown
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
          {
            foreignKeyName: "collection_items_creation_id_fkey"
            columns: ["creation_id"]
            isOneToOne: false
            referencedRelation: "trending_creations"
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
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
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
          search_vector: unknown
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
          search_vector?: unknown
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
          search_vector?: unknown
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
          {
            foreignKeyName: "creations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      leaderboard_cache: {
        Row: {
          avatar_url: string | null
          creation_count: number | null
          display_name: string | null
          gates_open: number | null
          id: string
          magic_rank: string | null
          period: string | null
          rank_position: number | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          creation_count?: number | null
          display_name?: string | null
          gates_open?: number | null
          id?: string
          magic_rank?: string | null
          period?: string | null
          rank_position?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          creation_count?: number | null
          display_name?: string | null
          gates_open?: number | null
          id?: string
          magic_rank?: string | null
          period?: string | null
          rank_position?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "likes_creation_id_fkey"
            columns: ["creation_id"]
            isOneToOne: false
            referencedRelation: "trending_creations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
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
      luminors: {
        Row: {
          avatar: string | null
          color: string | null
          companion_id: string | null
          created_at: string
          creator_id: string | null
          domain: string
          element: string
          export_formats: string[] | null
          gate_alignment: number[] | null
          gradient: string | null
          id: string
          knowledge: string[] | null
          name: string
          origin: string
          personality: string[]
          preferred_model: string | null
          published: boolean
          rating: number | null
          rating_count: number
          search_vector: unknown
          slug: string | null
          starters: string[] | null
          system_prompt: string
          tagline: string
          tags: string[] | null
          temperature: number | null
          tier: string
          title: string
          tools: string[] | null
          updated_at: string
          usage_count: number
          voice: string
          wisdom: string | null
        }
        Insert: {
          avatar?: string | null
          color?: string | null
          companion_id?: string | null
          created_at?: string
          creator_id?: string | null
          domain?: string
          element?: string
          export_formats?: string[] | null
          gate_alignment?: number[] | null
          gradient?: string | null
          id?: string
          knowledge?: string[] | null
          name: string
          origin?: string
          personality?: string[]
          preferred_model?: string | null
          published?: boolean
          rating?: number | null
          rating_count?: number
          search_vector?: unknown
          slug?: string | null
          starters?: string[] | null
          system_prompt: string
          tagline?: string
          tags?: string[] | null
          temperature?: number | null
          tier?: string
          title?: string
          tools?: string[] | null
          updated_at?: string
          usage_count?: number
          voice?: string
          wisdom?: string | null
        }
        Update: {
          avatar?: string | null
          color?: string | null
          companion_id?: string | null
          created_at?: string
          creator_id?: string | null
          domain?: string
          element?: string
          export_formats?: string[] | null
          gate_alignment?: number[] | null
          gradient?: string | null
          id?: string
          knowledge?: string[] | null
          name?: string
          origin?: string
          personality?: string[]
          preferred_model?: string | null
          published?: boolean
          rating?: number | null
          rating_count?: number
          search_vector?: unknown
          slug?: string | null
          starters?: string[] | null
          system_prompt?: string
          tagline?: string
          tags?: string[] | null
          temperature?: number | null
          tier?: string
          title?: string
          tools?: string[] | null
          updated_at?: string
          usage_count?: number
          voice?: string
          wisdom?: string | null
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
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pb_collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          element: string | null
          guardian_id: string | null
          icon: string | null
          id: string
          is_archived: boolean
          is_pinned: boolean
          metadata: Json
          name: string
          parent_id: string | null
          prompt_count: number
          share_token: string | null
          sort_order: number
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          element?: string | null
          guardian_id?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          metadata?: Json
          name: string
          parent_id?: string | null
          prompt_count?: number
          share_token?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          element?: string | null
          guardian_id?: string | null
          icon?: string | null
          id?: string
          is_archived?: boolean
          is_pinned?: boolean
          metadata?: Json
          name?: string
          parent_id?: string | null
          prompt_count?: number
          share_token?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "pb_collections_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pb_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pb_prompt_tags: {
        Row: {
          created_at: string
          prompt_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          prompt_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          prompt_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pb_prompt_tags_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "pb_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_prompt_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "pb_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      pb_prompt_versions: {
        Row: {
          change_summary: string | null
          content: string
          context_config: Json
          created_at: string
          diff_data: Json | null
          few_shot_examples: Json
          id: string
          negative_content: string | null
          prompt_id: string
          system_prompt: string | null
          user_id: string
          version: number
        }
        Insert: {
          change_summary?: string | null
          content: string
          context_config?: Json
          created_at?: string
          diff_data?: Json | null
          few_shot_examples?: Json
          id?: string
          negative_content?: string | null
          prompt_id: string
          system_prompt?: string | null
          user_id: string
          version: number
        }
        Update: {
          change_summary?: string | null
          content?: string
          context_config?: Json
          created_at?: string
          diff_data?: Json | null
          few_shot_examples?: Json
          id?: string
          negative_content?: string | null
          prompt_id?: string
          system_prompt?: string | null
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pb_prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "pb_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_prompt_versions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_prompt_versions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pb_prompts: {
        Row: {
          chain_steps: Json
          collection_id: string | null
          content: string
          context_config: Json
          created_at: string
          few_shot_examples: Json
          id: string
          is_archived: boolean
          is_favorite: boolean
          is_pinned: boolean
          is_template: boolean
          last_used_at: string | null
          metadata: Json
          negative_content: string | null
          prompt_type: string
          sort_order: number
          system_prompt: string | null
          template_variables: Json
          title: string
          updated_at: string
          use_count: number
          user_id: string
          version: number
        }
        Insert: {
          chain_steps?: Json
          collection_id?: string | null
          content?: string
          context_config?: Json
          created_at?: string
          few_shot_examples?: Json
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          is_pinned?: boolean
          is_template?: boolean
          last_used_at?: string | null
          metadata?: Json
          negative_content?: string | null
          prompt_type?: string
          sort_order?: number
          system_prompt?: string | null
          template_variables?: Json
          title: string
          updated_at?: string
          use_count?: number
          user_id: string
          version?: number
        }
        Update: {
          chain_steps?: Json
          collection_id?: string | null
          content?: string
          context_config?: Json
          created_at?: string
          few_shot_examples?: Json
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          is_pinned?: boolean
          is_template?: boolean
          last_used_at?: string | null
          metadata?: Json
          negative_content?: string | null
          prompt_type?: string
          sort_order?: number
          system_prompt?: string | null
          template_variables?: Json
          title?: string
          updated_at?: string
          use_count?: number
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pb_prompts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "pb_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pb_tags: {
        Row: {
          category: string | null
          collection_id: string | null
          color: string | null
          created_at: string
          icon: string | null
          id: string
          inject_position: string
          inject_text: string | null
          is_global: boolean
          name: string
          sort_order: number
          updated_at: string
          user_id: string
          weight_modifier: number | null
        }
        Insert: {
          category?: string | null
          collection_id?: string | null
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          inject_position?: string
          inject_text?: string | null
          is_global?: boolean
          name: string
          sort_order?: number
          updated_at?: string
          user_id: string
          weight_modifier?: number | null
        }
        Update: {
          category?: string | null
          collection_id?: string | null
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          inject_position?: string
          inject_text?: string | null
          is_global?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
          weight_modifier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pb_tags_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "pb_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pb_templates: {
        Row: {
          category: string
          chain_steps: Json
          content: string
          context_config: Json
          created_at: string
          description: string | null
          element: string | null
          few_shot_examples: Json
          guardian_id: string | null
          id: string
          is_public: boolean
          name: string
          negative_content: string | null
          prompt_type: string
          system_prompt: string | null
          tags: string[]
          updated_at: string
          use_count: number
          user_id: string | null
          variables: Json
        }
        Insert: {
          category: string
          chain_steps?: Json
          content: string
          context_config?: Json
          created_at?: string
          description?: string | null
          element?: string | null
          few_shot_examples?: Json
          guardian_id?: string | null
          id?: string
          is_public?: boolean
          name: string
          negative_content?: string | null
          prompt_type?: string
          system_prompt?: string | null
          tags?: string[]
          updated_at?: string
          use_count?: number
          user_id?: string | null
          variables?: Json
        }
        Update: {
          category?: string
          chain_steps?: Json
          content?: string
          context_config?: Json
          created_at?: string
          description?: string | null
          element?: string | null
          few_shot_examples?: Json
          guardian_id?: string | null
          id?: string
          is_public?: boolean
          name?: string
          negative_content?: string | null
          prompt_type?: string
          system_prompt?: string | null
          tags?: string[]
          updated_at?: string
          use_count?: number
          user_id?: string | null
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "pb_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pb_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
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
          stripe_customer_id: string | null
          subscription_ends_at: string | null
          subscription_tier: string | null
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
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_tier?: string | null
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
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_tier?: string | null
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          collection_slug: string
          completed_at: string | null
          created_at: string
          id: string
          progress_percent: number
          text_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_slug: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_percent?: number
          text_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_slug?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          progress_percent?: number
          text_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      element_distribution: {
        Row: {
          creation_count: number | null
          element: string | null
          percentage: number | null
          total_likes: number | null
          total_views: number | null
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          new_creations_7d: number | null
          new_users_30d: number | null
          new_users_7d: number | null
          total_chat_messages: number | null
          total_chat_sessions: number | null
          total_councils: number | null
          total_creations: number | null
          total_likes: number | null
          total_luminors: number | null
          total_users: number | null
          total_views: number | null
        }
        Relationships: []
      }
      trending_creations: {
        Row: {
          created_at: string | null
          creator_name: string | null
          element: string | null
          gate: string | null
          guardian: string | null
          id: string | null
          like_count: number | null
          title: string | null
          trending_score: number | null
          type: string | null
          user_id: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_engagement"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_engagement: {
        Row: {
          chat_session_count: number | null
          creation_count: number | null
          display_name: string | null
          gates_open: number | null
          joined_at: string | null
          last_active: string | null
          level: number | null
          likes_given: number | null
          likes_received: number | null
          magic_rank: string | null
          streak_days: number | null
          user_id: string | null
          views_received: number | null
          xp: number | null
        }
        Insert: {
          chat_session_count?: never
          creation_count?: never
          display_name?: string | null
          gates_open?: number | null
          joined_at?: string | null
          last_active?: string | null
          level?: number | null
          likes_given?: never
          likes_received?: never
          magic_rank?: string | null
          streak_days?: number | null
          user_id?: string | null
          views_received?: never
          xp?: number | null
        }
        Update: {
          chat_session_count?: never
          creation_count?: never
          display_name?: string | null
          gates_open?: number | null
          joined_at?: string | null
          last_active?: string | null
          level?: number | null
          likes_given?: never
          likes_received?: never
          magic_rank?: string | null
          streak_days?: number | null
          user_id?: string | null
          views_received?: never
          xp?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_messages_per_session: {
        Args: { session_ids: string[] }
        Returns: {
          message_count: number
          session_id: string
        }[]
      }
      fuzzy_search_creations: {
        Args: {
          result_limit?: number
          search_query: string
          similarity_threshold?: number
        }
        Returns: {
          id: string
          similarity: number
          title: string
          type: string
        }[]
      }
      get_leaderboard: {
        Args: { board_type?: string; result_limit?: number }
        Returns: {
          avatar_url: string
          display_name: string
          gates_open: number
          magic_rank: string
          rank: number
          score: number
          user_id: string
          xp: number
        }[]
      }
      get_unread_notification_count: { Args: never; Returns: number }
      increment_luminor_usage: {
        Args: { p_luminor_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { creation_id: string }
        Returns: undefined
      }
      mark_all_notifications_read: { Args: never; Returns: undefined }
      mark_notifications_read: {
        Args: { notification_ids: string[] }
        Returns: undefined
      }
      search_creations: {
        Args: {
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          description: string
          id: string
          like_count: number
          rank: number
          title: string
          type: string
          user_id: string
          view_count: number
        }[]
      }
      unlock_gate: {
        Args: { p_gate_name: string; p_gate_number: number; p_user_id: string }
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

