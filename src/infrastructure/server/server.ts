import express from "express"
import Auth from "../auth/auth";
import UserKnexRepository from "../repositories/knex/user-knex-repository";
import Bcrypt from "../crypt/bcrypt";
import { generateAuthRoutes } from "./routes/auth/auth-routes";
import generateAuthMiddleware from "./middlewares/auth-middleware";
import { generateAreaRoutes } from "./routes/area/area-routes";
import AreaKnexRepository from "../repositories/knex/area-knex-repository";
import { generateUserRoutes } from "./routes/user/user-routes";
import { generateCostCenterRoutes } from "./routes/cost-center/cost-center-routes";
import CostCenterKnexRepository from "../repositories/knex/cost-center-knex-repository";
import getEnvOrReturnError from "./../utils/get-env-or-return-error";
import getKnexConnection from "../repositories/knex/get-knex-connection";
import { Knex } from "knex";
import { generateImportRoutes } from "./routes/import/import-routes";
import RequesterKnexRepository from "../repositories/knex/requester-knex-repository";
import { generateRequesterRoutes } from "./routes/requester/requester-routes";
import { generateItemRoutes } from "./routes/item/item-routes";
import ItemKnexRepository from "../repositories/knex/item-knex-repository";
const bodyParser = require('body-parser');
var fileupload = require("express-fileupload");

export function runServer(knexArg? : Knex) {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(fileupload());

  const knex = knexArg ?? getKnexConnection();
  const userKnexRepository = new UserKnexRepository(knex);
  const areaKnexRepository = new AreaKnexRepository(knex);
  const costCenterKnexRepository = new CostCenterKnexRepository(knex);
  const requesterKnexRepository = new RequesterKnexRepository(areaKnexRepository, knex);
  const itemKnexRepository = new ItemKnexRepository(knex);

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

  const userRoutes = generateUserRoutes(userKnexRepository, auth);
  app.use('/user', userRoutes);
  
  const costCenterRoutes = generateCostCenterRoutes(costCenterKnexRepository);
  app.use('/costCenter', costCenterRoutes);

  const importRoutes = generateImportRoutes(knex);
  app.use('/import', importRoutes);

  const requesterRoutes = generateRequesterRoutes(requesterKnexRepository);
  app.use('/requester', requesterRoutes);

  const itemRoutes = generateItemRoutes(itemKnexRepository);
  app.use('/item', itemRoutes);

  if(getEnvOrReturnError("NODE_ENV") != "test") {
    console.log("Dando bind na porta")
    const port : number = Number(getEnvOrReturnError("PORT"));
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`)
    });
  }

  return app;
}
