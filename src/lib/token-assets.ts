import type { Token } from "./types";

export const tokenAssetFiles = [
  "bald.png",
  "Base god.png",
  "Based Pepe.png",
  "benji.png",
  "bored.png",
  "brett.png",
  "caw.png",
  "degen.png",
  "Dino.png",
  "doginme.png",
  "drb.png",
  "Higher.png",
  "keycat.png",
  "kibshi.png",
  "meow.png",
  "miggles.png",
  "noice.png",
  "Ping.png",
  "ponke.png",
  "russell.png",
  "Shib On Base.png",
  "ski.png",
  "toby.png",
  "toshi.png",
] as const;

const tokenAssetAliases: Record<string, string> = {
  BASE: "Base god.png",
  BASEGOD: "Base god.png",
  BASEDPEPE: "Based Pepe.png",
  SHIB: "Shib On Base.png",
  SHIBONBASE: "Shib On Base.png",
};

function normalizeTokenKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function withoutPng(fileName: string) {
  return fileName.replace(/\.png$/i, "");
}

const tokenAssetByKey = new Map(
  tokenAssetFiles.map((fileName) => [normalizeTokenKey(withoutPng(fileName)), fileName]),
);

function toPublicTokenAssetPath(fileName: string) {
  return `/assets/tokens/${encodeURIComponent(fileName)}`;
}

export function getTokenAssetPath(token: Pick<Token, "symbol" | "name">) {
  const candidates = [
    token.symbol,
    token.name,
    tokenAssetAliases[token.symbol.toUpperCase()],
    tokenAssetAliases[normalizeTokenKey(token.symbol).toUpperCase()],
    tokenAssetAliases[normalizeTokenKey(token.name).toUpperCase()],
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    const directFile = tokenAssetFiles.find((fileName) => fileName === candidate);
    const normalizedFile = tokenAssetByKey.get(normalizeTokenKey(withoutPng(candidate)));

    if (directFile) {
      return toPublicTokenAssetPath(directFile);
    }

    if (normalizedFile) {
      return toPublicTokenAssetPath(normalizedFile);
    }
  }

  return null;
}

