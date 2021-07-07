export interface BaseUser {
  id: number,
  name : string,
  email : string,
  role : "administrator" | "warehouse" | "commom",
}

export default interface User extends BaseUser {
  passwordHash : string,
}

export interface JWTUserData extends BaseUser {
  iat : number,
}

