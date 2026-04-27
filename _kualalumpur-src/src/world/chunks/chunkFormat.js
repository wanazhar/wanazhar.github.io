export const CHUNK_FORMAT_VERSION = 1;

export function countChunkInstances(chunk) {
  return Object.values(chunk.materials ?? {}).reduce((total, instances) => total + instances.length, 0);
}

export function validateJsonChunk(chunk) {
  const errors = [];
  if (!chunk || typeof chunk !== 'object') errors.push('chunk must be an object');
  if (!chunk?.id) errors.push('chunk.id is required');
  if (!chunk?.materials || typeof chunk.materials !== 'object') errors.push('chunk.materials is required');

  for (const [key, instances] of Object.entries(chunk?.materials ?? {})) {
    if (!Array.isArray(instances)) {
      errors.push(`${key} must be an array`);
      continue;
    }
    instances.forEach((item, index) => {
      if (!Array.isArray(item) || item.length !== 6 || item.some((value) => !Number.isFinite(value))) {
        errors.push(`${key}[${index}] must be [x,y,z,sx,sy,sz] finite numbers`);
      }
    });
  }

  return { ok: errors.length === 0, errors };
}
