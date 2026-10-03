/** Respect the deployment directory without changing local development URLs. */
export function assetUrl(path: string) { return `${import.meta.env?.BASE_URL ?? '/'}${path.replace(/^\//, '')}`; }
