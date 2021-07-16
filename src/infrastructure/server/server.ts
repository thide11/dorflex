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
import { generateSolicitationRoutes } from "./routes/solicitation/solicitation-routes";
import SolicitationKnexRepository from "../repositories/knex/solicitation-knex-repository";
import SolicitationItemKnexRepository from "../repositories/knex/solicitation-item-knex-repository";
import cors from "cors"
import https from 'https';
import path from 'path';
import fs from "fs";
import configureDocs from "./docs";
const bodyParser = require('body-parser');
var fileupload = require("express-fileupload");

export function runServer(knexArg? : Knex) {
  const app = express()
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(fileupload());
  app.use(cors());
  app.use(express.static('public', { dotfiles: 'allow' }));

  const knex = knexArg ?? getKnexConnection();
  const userKnexRepository = new UserKnexRepository(knex);
  const areaKnexRepository = new AreaKnexRepository(knex);
  const costCenterKnexRepository = new CostCenterKnexRepository(knex);
  const requesterKnexRepository = new RequesterKnexRepository(areaKnexRepository, knex);
  const itemKnexRepository = new ItemKnexRepository(knex);
  const solicitationItemRepository = new SolicitationItemKnexRepository(knex)
  const solicitationKnexRepository = new SolicitationKnexRepository(solicitationItemRepository, knex);
  const auth = new Auth(
    userKnexRepository,
    new Bcrypt(),
  )

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

  const solicitationRoutes = generateSolicitationRoutes(solicitationKnexRepository);
  app.use("/solicitation", solicitationRoutes)

  const nodeEnv = getEnvOrReturnError("NODE_ENV");
  if(nodeEnv != "test") {
    console.log("Dando bind na porta")
    configureDocs(app).then(() => {
      let options;
      if(nodeEnv == "production") {
        const basePath = '/etc/letsencrypt/live/vps18215.publiccloud.com.br/';
        console.log(`Carregando chave ssl de producao do diretório ${basePath}`)

        options = {
          key: fs.readFileSync(basePath + "privkey.pem", 'utf8'),
          cert: fs.readFileSync(basePath + "cert.pem", 'utf8'),
          ca: fs.readFileSync(basePath + "chain.pem", 'utf8'),
        };
      } else {
        console.log("Carregando certificado auto-assinado, navegador alertará sobre conexão insegura")

        options = {
          key: fs.readFileSync(path.resolve('selfsigned', 'server.key'), 'utf-8'),
          cert: fs.readFileSync(path.resolve('selfsigned', 'server.cert'), 'utf-8')
        };
      }

      const port : number = Number(getEnvOrReturnError("PORT")) ?? 443;
      const server = https.createServer(options, app);
      server.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
      });

    });
  }

  return app;
}
