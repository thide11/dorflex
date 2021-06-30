export default interface Crypt {
  encrypt(plainData : string, salt? : string) : Promise<string>;
  compare(plainData : string, encryptedData : string) : Promise<boolean>;
}