import express from "express"
import Auth from "../auth/auth";
import UserKnexRepository from "../infrastructure/repositories/knex/user-knex-repository";
import knex from "knex";
import Bcrypt from "../infrastructure/crypt/bcrypt";
import knexConfig from "../../knexfile";
import { generateAuthRoutes } from "./routes/auth/auth-routes";
import authMiddleware from "./middlewares/auth-middleware";
import generateAuthMiddleware from "./middlewares/auth-middleware";
import { generateAreaRoutes } from "./routes/area/area-routes";
import AreaKnexRepository from "../infrastructure/repositories/knex/area-knex-repository";
import { generateUserRoutes } from "./routes/user/user-routes";
import { generateCostCenterRoutes } from "./routes/cost-center/cost-center-routes";
import CostCenterKnexRepository from "../infrastructure/repositories/knex/cost-center-knex-repository";
const bodyParser = require('body-parser');

export async function runServer() {
  const app : any = express()
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  const port : number = Number(process.env.PORT) || 80


  const knexConnection = knex(knexConfig.development);

  // app.get("/", (req : any, res : any) => {
  //   res.send("Im alive!")
  // })

  const userKnexRepository = new UserKnexRepository(knexConnection);
  const areaKnexRepository = new AreaKnexRepository(knexConnection);
  const costCenterKnexRepository = new CostCenterKnexRepository(knexConnection);

  const auth = new Auth(
    userKnexRepository,
    new Bcrypt(),
  )

  app.get("/", async (_ : any, res : any) => {
    res.sendFile(__dirname + "/form.html");
  })
  
  app.get("/registrar", async (_ : any, res : any) => {
    res.sendFile(__dirname + "/register.html");
  });

  app.get("/painel", async (_ : any, res : any) => {
    res.sendFile(__dirname + "/painel.html");
  });

  const authMiddleware = generateAuthMiddleware(auth);
  app.use(authMiddleware);

  const authRoutes = generateAuthRoutes(userKnexRepository, auth);
  app.use('/auth', authRoutes);
  
  const areaRoutes = generateAreaRoutes(areaKnexRepository);
  app.use('/area', areaRoutes);

  const userRoutes = generateUserRoutes(userKnexRepository);
  app.use('/user', userRoutes);
  
  const costCenterRoutes = generateCostCenterRoutes(costCenterKnexRepository);
  app.use('/costCenter', costCenterRoutes);

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
  });
}
