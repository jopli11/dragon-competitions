export function getOptionalEnv(key: string) {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export function getRequiredEnv(key: string) {
  const value = getOptionalEnv(key);
  if (!value) {
    // During build time, we might not have all env vars.
    // We return a placeholder to avoid crashing the build if we're in a build-like environment.
    // Next.js sets NEXT_PHASE during build.
    if (process.env.NEXT_PHASE === "phase-production-build" || process.env.CI) {
      return `PLACEHOLDER_${key}`;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

