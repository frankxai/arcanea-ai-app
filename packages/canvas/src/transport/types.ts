import type { ClientMessage, ServerMessage } from '../protocol/types.ts';

export interface Transport {
  send(message: ClientMessage): void;
  onMessage(handler: (message: ServerMessage) => void): void;
  onConnectionChange(handler: (connected: boolean) => void): void;
  close(): void;
}
