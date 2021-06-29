import knex from "knex";
import Auth from "../../../auth/auth";
import UserRepository from "../../../domain/repositories/user-repository";

import express from 'express';
import { StatusCodes } from "http-status-codes";

export function generateAuthRoutes(userRepository : UserRepository, auth : Auth) {
  var router = express.Router();

  router.get("/user", async (req, res) => {
    // console.log(req.context);
    res.send(res.locals.context);
  })

  router.post("/login", async (req, res) => {
    console.log(req.body);
    const userToLogIn = req.body;
    console.log(userToLogIn);

    const usuario = await auth.autenticate(userToLogIn.email, userToLogIn.password);
    if(usuario) {
      res.send({
        token: usuario
      });
    } else { 
      res.sendStatus(401);
    }
  })

  return router;
}