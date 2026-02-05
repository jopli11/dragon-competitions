export function getOptionalEnv(key: string) {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

export function getRequiredEnv(key: string) {
  const value = getOptionalEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

