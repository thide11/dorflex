import express from "express"
import Auth from "../auth/auth";
import UserKnexRepository from "../infrastructure/repositories/knex/user-knex-repository";
import knex from "knex";
import Bcrypt from "../infrastructure/crypt/bcrypt";
import knexConfig from "../../knexfile";
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

  const authMiddleware = async (req : any, res : any, next : any) => {
    if(req.body.token) {
      const data = await auth.exchangeJwtToUser(req.body.token);
      req.context = data;
    }
    next();
  }

  app.use(authMiddleware);

  app.get("/auth/user", async (req : any, res : any) => {
    res.send(req.context);
    // res.sendStatus(400);
  })
  
  app.post("/auth/login", async (req : any, res : any) => {
    console.log(req.body);
    const userToLogIn = req.body;
    console.log(userToLogIn);

    const usuario = await auth.autenticate(userToLogIn.email, userToLogIn.password);
    if(usuario) {
      console.log(usuario)
      res.send({
        token: usuario
      });
      // res.sendStatus(200);
      // res.send("Usuario pego!")
    } else { 
      res.sendStatus(401);
    }
  })

  app.get("/authlistar", async (_ : any, res : any) => {
    const usuarios = await userKnexRepository.list()
    console.log(usuarios)
    res.send("Usuario listados!")
  })

  app.post("/auth/register", async(req : any, res : any) => {
    const data = req.body;
    const userUsingAdress = await userKnexRepository.getByEmail(data.email);
    if(userUsingAdress) {
      res.sendStatus(409);
      // res.send("Usuario já existe!")
    }
    await auth.register(data.name, data.email, data.password);
    res.sendStatus(200);
    // res.send("Usuario salvo!")
  })

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
  });
}
