import getEnvOrReturnError from "./get-env-or-return-error";

export default function isDevEnvironment() {
  const environment = getEnvOrReturnError("NODE_ENV");
  return ["development", "test"].includes(environment);
}