import Crypt from "../../domain/crypt/crypt";
import bcrypt from "bcrypt";

export default class Bcrypt implements Crypt {
  encrypt(plainData: string): Promise<string> {
    return bcrypt.hash(plainData, 10);
  }
  compare(plainData : string, encryptedData : string) {
    return bcrypt.compare(plainData, encryptedData)
  }
}