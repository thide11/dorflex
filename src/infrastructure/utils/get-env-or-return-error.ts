export default function getEnvOrReturnError(envKey : string) : string {
  const envValue = process.env[envKey];
  if(!envValue) {
    throw new Error(`Você precisa definir a variabel do ambiente ${envKey}`)
  }
  return envValue;
}