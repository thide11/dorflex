import dotenv from "dotenv";
dotenv.config();
import { runServer } from "./infrastructure/server/server"

(async function () {
  await runServer();
})();