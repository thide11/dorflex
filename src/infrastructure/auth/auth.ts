import jwt from "jsonwebtoken";
import knex from "knex"
import UserRepository from "../../domain/repositories/user-repository";
import bcrypt from "bcrypt";
import Crypt from "../../domain/crypt/crypt";
import User from "../../domain/models/user";
import { AppErrorCode } from "../../domain/error/app-error-code";
import AppError from "../../domain/error/app-error";
import isDevEnvironment from "../utils/is-dev-environment";
import testToken from "../utils/test-token";
import testUser from "../utils/test-user";

const privateKey = process.env.PRIVATE_KEY || "shh";

export default class Auth {

  constructor(private userRepository : UserRepository, private crypt : Crypt) {}

  async register(username : string, email : string, plainPassword : string) {
    
    //@ts-ignore
    const user = await this.userRepository.insert({
      email: email,
      name: username,
      // role: "administrator",
      passwordHash: await this.crypt.encrypt(plainPassword),
    })

    return this.gerarJwt(user);
  }

  async exchangeJwtToUser(token : string) {
    if(isDevEnvironment() && token == testToken()) {
      return testUser();
    }
    const data = jwt.decode(token);
    if(data == null) {
      throw new AppError(AppErrorCode.INVALID_TOKEN);
    }
    return data;
  }

  async autenticate(email : string, plainPassword : string) {
    const user = await this.userRepository.getByEmail(email);
    if(user != null) {
      const isPasswordCorrect = await this.crypt.compare(plainPassword, user.passwordHash);
      if(isPasswordCorrect) {
        return this.gerarJwt(user);
      }
    }
  }

  private gerarJwt(user : User) { 
    const expirationToken = new Date().getTime() + 3600;
    return jwt.sign(
      {
      name: user.name,
      email: user.email,
      role: "administrator",
      expirationToken,
      }, 
      privateKey
    );
  }
}