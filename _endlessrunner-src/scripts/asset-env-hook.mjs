/**
 * Node loader hook for the test suite.
 *
 * Vite replaces `import.meta.env.BASE_URL` at build time, so importing
 * src/assets/AssetRegistry.js under plain `node --test` would throw on
 * `undefined`. Rewrite just that expression to the deployed base path; every
 * other module is passed through untouched.
 */
const ASSET_REGISTRY = /\/src\/assets\/AssetRegistry\.js$/;

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (!ASSET_REGISTRY.test(url) || !result.source) return result;
  const source = Buffer.from(result.source).toString('utf8');
  return {
    format: 'module',
    shortCircuit: true,
    source: source.replace('import.meta.env.BASE_URL', "'/endlessrunner/'")
  };
}
