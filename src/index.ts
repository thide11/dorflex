import dotenv from "dotenv"
import { runServer } from "./infrastructure/server/server"
dotenv.config();

(async function () {
  await runServer();
})();