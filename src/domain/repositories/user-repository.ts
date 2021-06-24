import User from "../models/user";
import BaseRepository from "./base-repository";

export default interface UserRepository extends BaseRepository<User> {
  getByEmail(email : string) : Promise<User | undefined>;
  getByEmailAndPassword(email : string, password : string) : Promise<User | undefined>;
}