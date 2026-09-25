// src\schemas\onboarding.schema.ts
import { z } from "zod";
import { rules } from "./common-rules";

export const createMosqueSchema = z.object({
  name: rules.name,
  address: rules.address,
  phone: rules.phone,
});

export const joinMosqueSchema = z.object({
  inviteCode: rules.inviteCode,
});

export type CreateMosqueInput = z.infer<typeof createMosqueSchema>;
export type JoinMosqueInput = z.infer<typeof joinMosqueSchema>;
