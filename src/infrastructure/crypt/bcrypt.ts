import Crypt from "../../domain/crypt/crypt";
import bcrypt from "bcryptjs";

export default class Bcrypt implements Crypt {

  DEFAULT_ROUNDS = 9;

  encrypt(plainData: string, salt?: string): Promise<string> {
    return bcrypt.hash(plainData, salt ?? this.DEFAULT_ROUNDS);
  }

  compare(plainData : string, encryptedData : string) {
    return bcrypt.compare(plainData, encryptedData)
  }
}