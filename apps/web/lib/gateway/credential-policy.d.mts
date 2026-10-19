import type { ProviderId } from "./types";
export const PUBLIC_INFERENCE_TIER: "seeker";
export class CredentialPolicyError extends Error {
  status: number;
}
export function validateCustomerKey(value: unknown): string;
export function extractCustomerKeys(
  headers: Headers,
): Partial<Record<ProviderId, string>>;
