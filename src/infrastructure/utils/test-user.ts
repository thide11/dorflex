import User, { JWTUserData } from "../../domain/models/user";

export default function testUser() {
  return {
    email: "fake@email.com.br",
    name: "Thiago",
    role: "administrator",
    id: 0,
    iat: 234235,
  } as JWTUserData;
}