import Crypt from "../../domain/crypt/crypt";
import bcrypt from "bcrypt";

export default class Bcrypt implements Crypt {
  encrypt(plainData: string, salt?: string): Promise<string> {
    return bcrypt.hash(plainData, salt ?? 10);
  }
  compare(plainData : string, encryptedData : string) {
    return bcrypt.compare(plainData, encryptedData)
  }
}