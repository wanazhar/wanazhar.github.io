export class ChunkLoader {
  constructor() {
    this.loaded = new Map();
  }

  register(chunk) {
    this.loaded.set(chunk.id, chunk);
  }

  get(id) {
    return this.loaded.get(id);
  }

  clear() {
    this.loaded.clear();
  }
}

export function resolveStaticChunkUrl(path = 'chunks/metadata.json', baseUrl = globalThis.location?.href) {
  if (!baseUrl) return path;
  return new URL(path, baseUrl).toString();
}

export async function loadStaticChunkManifest(options = {}) {
  const fetcher = options.fetcher ?? globalThis.fetch?.bind(globalThis);
  if (!fetcher) return null;

  const url = options.url ?? resolveStaticChunkUrl(options.path ?? 'chunks/metadata.json', options.baseUrl);
  const response = await fetcher(url, { cache: options.cache ?? 'force-cache' });
  if (!response.ok) throw new Error(`Failed to load static chunk manifest: ${response.status} ${url}`);

  const manifest = await response.json();
  if (!manifest || !Array.isArray(manifest.chunks)) {
    throw new Error('Invalid static chunk manifest: chunks array missing');
  }
  return manifest;
}
