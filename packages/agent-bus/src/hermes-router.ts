import net from "node:net";
import { AgentBus } from "./agent-bus.js";
import type { Message, MessageId, Topic } from "./types.js";

interface Packet {
  type: "register" | "message" | "subscribe" | "publish";
  agentId?: string;
  topic?: string;
  message?: Message;
}

/**
 * HermesRouter — high-performance cross-process message router.
 * Employs JSONL-over-TCP framing to link Node.js, Python, and on-chain runtimes.
 */
export class HermesRouter {
  private server: net.Server | null = null;
  private bus: AgentBus;
  private port: number;
  private clients = new Map<string, net.Socket>(); // agentId -> Socket
  private clientIds = new Map<net.Socket, string>(); // Socket -> agentId
  private activeSubscriptions = new Map<string, string>(); // subscriptionId -> topic

  constructor(bus: AgentBus, port: number = 8520) {
    this.bus = bus;
    this.port = port;
  }

  /**
   * Starts the TCP messaging server.
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = net.createServer((socket) => {
        let buffer = "";

        socket.on("data", (data) => {
          buffer += data.toString();
          let boundary = buffer.indexOf("\n");

          while (boundary !== -1) {
            const line = buffer.substring(0, boundary).trim();
            buffer = buffer.substring(boundary + 1);
            boundary = buffer.indexOf("\n");

            if (line) {
              try {
                const packet = JSON.parse(line) as Packet;
                this.handlePacket(socket, packet);
              } catch (e: any) {
                this.sendError(socket, `Invalid JSON: ${e.message}`);
              }
            }
          }
        });

        socket.on("close", () => {
          this.handleDisconnect(socket);
        });

        socket.on("error", (err) => {
          console.error(`[HermesRouter] Socket error: ${err.message}`);
          socket.destroy();
        });
      });

      this.server.listen(this.port, () => {
        console.log(`[HermesRouter] Active and listening on port ${this.port}`);
        resolve();
      });

      this.server.on("error", (err) => {
        reject(err);
      });
    });
  }

  /**
   * Stops the server and closes all active connections.
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      // Clear subscriptions
      for (const [subId] of this.activeSubscriptions) {
        this.bus.unsubscribe(subId);
      }
      this.activeSubscriptions.clear();

      if (this.server) {
        this.server.close(() => {
          console.log("[HermesRouter] Stopped.");
          resolve();
        });
        for (const socket of this.clientIds.keys()) {
          socket.destroy();
        }
      } else {
        resolve();
      }
    });
  }

  /**
   * Handles an incoming packet from a socket connection.
   */
  private handlePacket(socket: net.Socket, packet: Packet) {
    switch (packet.type) {
      case "register":
        if (packet.agentId) {
          this.clients.set(packet.agentId, socket);
          this.clientIds.set(socket, packet.agentId);
          console.log(`[HermesRouter] Registered agent: ${packet.agentId}`);
          this.sendOk(socket, `Registered as ${packet.agentId}`);
        }
        break;

      case "subscribe":
        if (packet.topic) {
          const agentId = this.clientIds.get(socket) || "anonymous-tcp";
          const subId = this.bus.subscribe(packet.topic, (message) => {
            // Forward message to the subscriber
            this.sendPacket(socket, {
              type: "message",
              message,
            });
          });
          this.activeSubscriptions.set(subId, packet.topic);
          console.log(`[HermesRouter] Agent "${agentId}" subscribed to topic "${packet.topic}"`);
          this.sendOk(socket, `Subscribed to ${packet.topic}`);
        }
        break;

      case "publish":
        if (packet.message) {
          const msg = packet.message;
          // Publish locally onto the in-memory bus
          this.bus.publish(msg.from, msg.topic, msg.payload, {
            priority: msg.priority,
            ttl: msg.ttl,
            metadata: msg.metadata,
          }).then((msgId) => {
            // Also check for direct delivery
            if (msg.to && msg.to !== "*") {
              const destSocket = this.clients.get(msg.to);
              if (destSocket) {
                this.sendPacket(destSocket, {
                  type: "message",
                  message: msg,
                });
              }
            }
          });
        }
        break;

      case "message":
        if (packet.message) {
          const msg = packet.message;
          // Route direct messages
          if (msg.to && msg.to !== "*") {
            const destSocket = this.clients.get(msg.to);
            if (destSocket) {
              this.sendPacket(destSocket, {
                type: "message",
                message: msg,
              });
            } else {
              // Push to bus to trigger local handlers or default dead letters
              this.bus.send(msg.from, msg.to, msg.topic, msg.payload, {
                priority: msg.priority,
                ttl: msg.ttl,
                metadata: msg.metadata,
              });
            }
          } else {
            // Broad broadcast / event pub
            this.bus.publish(msg.from, msg.topic, msg.payload, {
              priority: msg.priority,
              ttl: msg.ttl,
              metadata: msg.metadata,
            });
          }
        }
        break;
    }
  }

  private handleDisconnect(socket: net.Socket) {
    const agentId = this.clientIds.get(socket);
    if (agentId) {
      this.clients.delete(agentId);
      this.clientIds.delete(socket);
      console.log(`[HermesRouter] Agent disconnected: ${agentId}`);
    }
  }

  private sendPacket(socket: net.Socket, packet: any) {
    if (socket.writable) {
      socket.write(JSON.stringify(packet) + "\n");
    }
  }

  private sendOk(socket: net.Socket, message: string) {
    this.sendPacket(socket, { status: "ok", message });
  }

  private sendError(socket: net.Socket, error: string) {
    this.sendPacket(socket, { status: "error", error });
  }
}
