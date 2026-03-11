declare module '@fal-ai/client' {
  interface FalConfig {
    credentials: string;
  }
  interface FalClient {
    config(options: FalConfig): void;
    subscribe(model: string, options: { input: Record<string, unknown> }): Promise<{ data: Record<string, unknown> }>;
  }
  export const fal: FalClient;
}
