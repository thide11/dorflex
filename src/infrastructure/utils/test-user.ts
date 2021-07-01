import User from "../../domain/models/user";

export default function testUser() {
  return {
    email: "fake@email.com.br",
    name: "Thiago",
    role: "administrator"
  } as User;
}