import dotenv from "dotenv"
import { runServer } from "./server/server"
dotenv.config();

(async function () {
  await runServer();
})();