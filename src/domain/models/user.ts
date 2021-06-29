export default interface User {
  name : string,
  email : string,
  role : "administrator" | "warehouse" | "commom"
  passwordHash : string,
}