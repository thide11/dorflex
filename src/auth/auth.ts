import jwt from "jsonwebtoken";
import knex from "knex"
import UserRepository from "../domain/repositories/user-repository";
import bcrypt from "bcrypt";
import Crypt from "../domain/crypt/crypt";
import User from "../domain/models/user";

const privateKey = process.env.PRIVATE_KEY || "shh";

export default class Auth {

  constructor(private userRepository : UserRepository, private crypt : Crypt) {}

  async register(username : string, email : string, plainPassword : string) {
    
    const user = await this.userRepository.insert({
      email: email,
      name: username,
      passwordHash: await this.crypt.encrypt(plainPassword),
    })

    return this.gerarJwt(user);
  }

  async exchangeJwtToUser(token : string) {
    const data = jwt.decode(token);
    console.log(data);
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
      email: user.email,
      expirationToken,
      }, 
      privateKey
    );
  }
}