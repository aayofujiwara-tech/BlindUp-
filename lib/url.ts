import LZString from "lz-string";

export function encodeConfig(data: object): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeConfig<T>(str: string): T | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(str);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}