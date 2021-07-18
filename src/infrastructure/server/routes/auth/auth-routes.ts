import knex from "knex";
import Auth from "../../../auth/auth";
import UserRepository from "../../../../domain/repositories/user-repository";

import express from 'express';
import { StatusCodes } from "http-status-codes";

export function generateAuthRoutes(userRepository : UserRepository, auth : Auth) {
  var router = express.Router();

  router.get("/", async (_, res) => {
    if(res.locals.context != null) {
      res.send(res.locals.context);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send();
    }
  })

  router.post("/login", async (req, res) => {
    const userToLogIn = req.body;
    const usuario = await auth.autenticate(userToLogIn.email, userToLogIn.password);
    if(usuario) {
      res.send({
        token: usuario
      });
    } else { 
      res.status(StatusCodes.UNAUTHORIZED).send();
    }
  })

  return router;
}