import getEnvOrReturnError from "../../server/utils/get-env-or-return-error";
import knex, { Knex } from "knex";
import knexConfig from "../../../../knexfile";

export default function getKnexConnection() : Knex {
  const environment = getEnvOrReturnError("NODE_ENV");
  return knex(
    //@ts-ignore
    knexConfig[environment]
  );
}