import User, { BaseUser } from "./user";

export default interface UncryptedUser extends BaseUser {
  password : string,
}