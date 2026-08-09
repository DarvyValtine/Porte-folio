"use client";

import { createAuthClient } from "better-auth/react";

function normalizeURL(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

const baseURL = normalizeURL(
  process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
);

export const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession } = authClient;